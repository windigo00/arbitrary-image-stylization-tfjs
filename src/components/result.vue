<template>
  <div>
    <canvas ref="out" />
  </div>
</template>

<script>
    import WorkerFactory from '../lib/WorkerFactory';

    export default {
        name: 'ResultImage',
        props: {
            sourceData: {
                type: Array,
                default: null
            },
            styleData: {
                type: Array,
                default: null
            },
            styleModel: {
                type: Object,
                default: null
            },
            transformerModel: {
                type: Object,
                default: null
            },
            backend: {
                type: String,
                default: null
            }
        },

        data() {
            return {
                net: null
            };
        },
        watch: {
            backend() {
                this.initWorker();
            }
        },

        created() {
            this.initWorker();
        },

        destroyed() {
            if (this.offscreenWorker) {
                this.offscreenWorker.terminate();
                this.offscreenWorker = null;
            }
        },

        updated() {
            this.initWorker();
        },

        mounted() {
        },

        methods: {
            initWorker() {
                if (this.offscreenWorker) {
//                    console.log('terminate');
                    this.offscreenWorker.terminate();
                }
                this.offscreenWorker = WorkerFactory.getWorker('node_'+this.backend, this.handleMessage, this.errorMessage);
                this.offscreenWorker.post('init');
            },

            handleMessage(e) {
//                console.log(e);
                var canvas = this.$refs['out'];
                if (!e) {
                  return;
                } else if (!e.event) {
                    this.$emit('message', e);
                } else if (e.event == 'done') {
                    this.initWorker();
                    this.$emit('message', e.data);
                } else {
                    switch (e.event) {
                        case 'style-predict':
                            console.log(e.data.content);
                            break;
                        case 'change':
//                            console.log(e);

                            this.$emit('change', e.image);
                            canvas.width = e.image.width;
                            canvas.height = e.image.height;
                            canvas.getContext('2d').putImageData(e.image, 0, 0);
                            break;
                        case 'initialized':
                            this.$emit('init');
                            break;

                        case 'error':
//                            console.log(e);
//                            e.data.message.preventDefault();
//                            console.log(e.message);
                            this.$emit('error', e.data.message.message);
                        break;
                        default:
                            console.log('def');
                        break;
                    }
                }
            },

            errorMessage(e) {
                e.preventDefault();
                this.$emit('error', e.message);
            },

            predict() {
                this.offscreenWorker.post(
                    'style',
                    this.offscreenWorker.prepareData({
                        sourceData:       this.sourceData,
                        styleData:        this.styleData,
                        styleModel:       this.styleModel,
                        transformerModel: this.transformerModel,
                        backend:          this.backend,
                    })
                );
            }
        }
    }
</script>
