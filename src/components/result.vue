<template>
    <div>
        <canvas ref="out"></canvas>
    </div>
</template>

<script>

    import Dnn from '../dnn/dnn.js';

    export default {
        name: 'result_image',
        props: ['options'],
        data() {
//            console.log(this.options)
            return {
                net: null
            };
        },

        methods: {
            predict() {
                if (!this.net) {
//                    var opts = Object.assign({},this.options);
//                    opts.canvas= null;
                    this.net = new Dnn(this.options);
                    this.net.eventManager = this;
                }
                this.net.predict(this.$refs.out);
            }
        }
    }
</script>
