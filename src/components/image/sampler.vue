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
        computed: {
            samplerClass() {
                return {
                    image    : true,
                    centered : true,
                    pixelated: !this.smooth
                }
            }
        },
        methods: {
            async prepareImage() {
                this.processImage(this.image);
            },

            processImage() {
                if (!this.image) return;
                if (!this.image.width) return;

                if (!('transferControlToOffscreen' in this.$refs['output'])) {
                    throw new Error('webgl in worker unsupported');
                }

                Promise.all([
                    createImageBitmap(this.image)
                ])
                .then(this.renderImage.bind(this))

            },

            renderImage(event) {

                var data = {
                    image: event[0],
                    square: this.square,
                    size:   this.size,
                    smooth: this.smooth
                };
                var transfer = null;
//                var imageProcessed = null;
                if (!this.imageProcessed) {
                    this.imageProcessed = this.$refs['output'].transferControlToOffscreen();
                    data.canvas = this.imageProcessed;
                    transfer = [this.imageProcessed];
                }
                if (!this.offscreenWorker) {
                    this.offscreenWorker = new Worker('worker.js');
                }
                this.offscreenWorker.postMessage(data, transfer);
//                this.$emit('change', {image : this.value.image});
            }
        },
        created() {
            this.imageProcessed  = null;
            this.offscreenWorker = null;
        },
        updated() {
            this.prepareImage();
        }
    }
</script>
