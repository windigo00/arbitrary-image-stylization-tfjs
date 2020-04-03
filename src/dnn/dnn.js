
// import 'babel-polyfill';
//import * as tf from '@tensorflow/tfjs';

//var callback
//var worker = new Worker('dnn_worker.js');
//worker.onmessage = e => {
//    console.log('change', e.data);
//
//};

export default class Dnn {

    constructor(options, tf) {
        this.opts = options;
        if (tf) {
            this.tf = tf;
        }
        this.models = {
        };
    }

    updateData(options) {
        this.opts = options;
    }

    isModelLoaded(type) {
//        console.log(this);
        var t = this.opts[type+'Model'];
//        console.log(t);
        return this.models[t.name] != null;
    }

    async loadModel(type, modelData) {

        postMessage(' - '+ modelData.title);
        return await this.tf.loadGraphModel('../'+modelData.model);
    }

    async _loadModels() {
        if (!this.isModelLoaded('style')) {
            this.models[this.opts.styleModel.name] = await this.loadModel('style', this.opts.styleModel);
        }
        if (!this.isModelLoaded('transformer')) {
            this.models[this.opts.transformerModel.name] = await this.loadModel('transformer', this.opts.transformerModel);
        }
    }
//
    async predict(canvas) {
        this.canvas = canvas;
        postMessage('Loading Models...');
        await this._loadModels();
//        console.log(this.tf.memory());

        if (this.canvas) {

            var styles = this.opts.styleData;
            var source = this.opts.sourceData[0];
            var styleNet = this.models[this.opts.styleModel.name];
            var transformerNet = this.models[this.opts.transformerModel.name];
            // unit of overall ratios (1%)
            var ratioUnit = 0.0;
            for (let i = 0, max = styles.length; i < max; i++) {
                ratioUnit += styles[i].ratio;
            }

            var bottleneck,
                scaled,
                combinedBottleneck,
                styled;

            await this.tf.nextFrame();

            for(let i = 0, max = styles.length; i < max; i++) {
                postMessage(`Generating 100D style representation of image #${i}`);
                await this.tf.nextFrame();

                bottleneck = await this.tf.tidy(() => {
                    return styleNet.predict(this.tf.browser.fromPixels(styles[i].resampled).toFloat().div(this.tf.scalar(255)).expandDims());
                });

                postMessage('Adding styles...');
                var r = styles[i].ratio / ratioUnit
//                console.log(r);

                scaled = bottleneck.mul(this.tf.scalar(r));
                if (combinedBottleneck) {
                    combinedBottleneck.addStrict(scaled);
                } else {
                    combinedBottleneck = scaled;
                }
//                scaled.dispose();
            }

            postMessage('Stylizing image...');
            styled = await this.tf.tidy(() => {
                return transformerNet.predict([
                    this.tf.browser.fromPixels(source.resampled).toFloat().div(this.tf.scalar(255)).expandDims(),
                    combinedBottleneck
                ]).squeeze();
            });

            await this.tf.browser.toPixels(styled, this.canvas);

            // Might wanna keep this around
//            combinedBottleneck.dispose();
//            styled.dispose();

            let rendered = this.canvas.getContext('2d').getImageData(0, 0, this.canvas.width, this.canvas.height);
            postMessage({event: 'change', image: rendered});
        }
    }
}
