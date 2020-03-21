
// import 'babel-polyfill';
import * as tf from '@tensorflow/tfjs';

export default class Dnn {
    constructor(eventHandler) {
        this.models = {
            mobileNet: 'saved_model_style_js/model.json',
            inception: 'saved_model_style_inception_js/model.json',
            originalTransformer: 'saved_model_transformer_js/model.json',
            separableTransformer: 'saved_model_transformer_separable_js/model.json'
        }
        this.eventHandler = eventHandler;
        this.eventHandler.$emit('done', 1);
    }

    async loadModel(modelPath) {
        if (!this.mobileStyleNet) {
            this.mobileStyleNet = await tf.loadGraphModel(modelPath);
        }

        return this.mobileStyleNet;
    }

    async benchmark() {
        const x = tf.randomNormal([1, 256, 256, 3]);
        const bottleneck = tf.randomNormal([1, 1, 1, 100]);

        let styleNet = await this.loadModel(this.models.inception);
        let time = await this.benchmarkStyle(x, styleNet);
        styleNet.dispose();

        styleNet = await this.loadModel(this.models.mobileNet);
        time = await this.benchmarkStyle(x, styleNet);
        styleNet.dispose();

        let transformNet = await this.loadModel(this.models.originalTransformer);
        time = await this.benchmarkTransform(
                x, bottleneck, transformNet);
        transformNet.dispose();

        transformNet = await this.loadModel(this.models.separableTransformer);
        time = await this.benchmarkTransform(
                x, bottleneck, transformNet);
        transformNet.dispose();

        x.dispose();
        bottleneck.dispose();
    }

    async benchmarkStyle(x, styleNet) {
        const profile = await tf.profile(() => {
            tf.tidy(() => {
                const dummyOut = styleNet.predict(x);
                dummyOut.print();
            });
        });
        console.log(profile);
        const time = await tf.time(() => {
            tf.tidy(() => {
                for (let i = 0; i < 10; i++) {
                    const y = styleNet.predict(x);
                    y.print();
                }
            })
        });
        console.log(time);
    }

    async benchmarkTransform(x, bottleneck, transformNet) {
        const profile = await tf.profile(() => {
            tf.tidy(() => {
                const dummyOut = transformNet.predict([x, bottleneck]);
                dummyOut.print();
            });
        });
        console.log(profile);
        const time = await tf.time(() => {
            tf.tidy(() => {
                for (let i = 0; i < 10; i++) {
                    const y = transformNet.predict([x, bottleneck]);
                    y.print();
                }
            })
        });
        console.log(time);
    }
}