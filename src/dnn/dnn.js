
// import 'babel-polyfill';
import * as tf from '@tensorflow/tfjs';

export class Dnn {
    constructor(eventHandler) {
        this.models = {
            styleNet : 'saved_model_style_js/model.json',
            inception: 'saved_model_style_inception_js/model.json',
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
}