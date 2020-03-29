<template>
    <div v-show="image">
        <canvas :class="samplerClass" ref="output"></canvas>
    </div>
</template>

<script>
    export default {
        name: 'image_sampler',
        props: ['image', 'size', 'smooth', 'square'],
        watch: {
            image (){ this.$forceUpdate(); },
            size  (){ this.$forceUpdate(); },
            smooth(){ this.$forceUpdate(); },
            square(){ this.$forceUpdate(); }
        },
        data() {
            return {
                offscreenWorker: null
            };
        },
        computed: {
            samplerClass() {
                return {
                    image    : true,
                    centered : true,
                    pixelated: !this.smooth
                }
            },

            worker() {
                if (!this.offscreenWorker) {
                    this.offscreenWorker = new Worker('data_worker.js');
                    this.offscreenWorker.onmessage = this.handleMessage.bind(this);
//                    this.offscreenWorker.postMessage = e => {};
                }
                return this.offscreenWorker;
            }
        },

        methods: {
            handleMessage(e) {
                switch(e.data.event) {
                    case 'change':
                        this.$emit('change', e.data.image);
                    break;

                    case 'error':
                        throw new Error(e.data.message);
                    break;
                }
            },

            async prepareImage() {
                this.processImage(this.image);
            },

            processImage() {
                
                if (!this.image) return;
                if (!this.image.width) return;

                Promise.all([
                    createImageBitmap(this.image)
                ])
                .then(this.renderImage.bind(this))

            },

            renderImage(event) {

                var data = {
                    event: 'render',
                    image: event[0],
                    square: this.square,
                    size:   this.size,
                    smooth: this.smooth
                };
                // var transfer = null;
                // var that = this;

                this.worker.postMessage(data);
//                this.$emit('change', {image : this.value.image});
            }
        },
        created() {
            this.imageProcessed  = null;
        },
        mounted() {

            if (!('transferControlToOffscreen' in this.$refs['output'])) {
                throw new Error('webgl in worker unsupported');
            }

            if (!this.imageProcessed) {
                this.imageProcessed = this.$refs['output'].transferControlToOffscreen();
                this.worker.postMessage({
                    event: 'init',
                    canvas: this.imageProcessed
                }, [this.imageProcessed]);
            }

        },
        updated() {
            this.prepareImage();
        },
        destroyed() {
            console.log('terminate');
            this.worker.terminate();
            this.imageProcessed = null;
        }
    }
</script>
