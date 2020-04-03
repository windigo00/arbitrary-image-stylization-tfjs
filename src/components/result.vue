<template>
  <div>
    <canvas ref="out" />
  </div>
</template>

<script>
    import WorkerFactory from '../lib/worker_factory';

    export default {
        name: 'ResultImage',
        props: {
            options: {
                type: Object,
                default: null
            }
        },
        data() {
//            console.log(this.options)
            return {
                net: null
            };
        },

        created() {
            this.offscreenWorker = WorkerFactory.getWorker('dnn', this.handleMessage, this.errorMessage);
        },

        destroyed() {
            if (this.offscreenWorker) {
                this.offscreenWorker.terminate();
                this.offscreenWorker = null;
            }
            this.imageProcessed = null;
        },

        mounted() {

//            if (!('transferControlToOffscreen' in this.$refs['out'])) {
//                throw new Error('webgl in worker unsupported');
//            }

            if (!this.imageProcessed) {
//                this.imageProcessed = this.$refs['out'].transferControlToOffscreen();
                this.offscreenWorker.post('init');
            }

        },

        methods: {
            handleMessage(e) {
                var canvas = this.$refs['out'];
                if (e.data == 'done') {
                    this.offscreenWorker.terminate();
                    this.offscreenWorker = WorkerFactory.getWorker('dnn', this.handleMessage, this.errorMessage);
                    this.offscreenWorker.post('init');
                    this.$emit('message', e.data);
                } else if (!e.data.event) {
                    this.$emit('message', e.data);
                } else {
                    switch (e.data.event) {
                        case 'change':
                            this.$emit('change', e.data.image);
                            canvas.width = e.data.image.width;
                            canvas.height = e.data.image.height;
                            canvas.getContext('2d').putImageData(e.data.image, 0, 0);
                            break;
                        case 'initialized':
                            this.$emit('init');
                            break;

                        case 'error':
                            this.$emit('error', e.data);
                        break;
                        default:
                            console.log('def');
                            console.log(e);
                        break;
                    }
                }
            },

            errorMessage(e) {
                this.$emit('message', e.data);
            },

            predict() {
                this.offscreenWorker.post('style', this.options);
            }
        }
    }
</script>
