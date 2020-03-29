
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
//        console.log(arguments);
        this.models = {
        };
//        this.model = eventHandler.model;
//        this.eventHandler = eventHandler;
//        this.offscreenWorker =
//        this.eventHandler.$emit('done', 1);
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

        postMessage('loading '+ modelData.model);
        return await this.tf.loadGraphModel(modelData.model);
    }

    get Worker() {
        if (!this._worker) {
            this._worker = new Worker('dnn_worker.js');
            this._worker.onmessage = this.catchMessage.bind(this);
//            this._worker.postMessage = e => {};
        }
        return this._worker;
    }

    catchMessage(messageEvent) {
//        console.log(this);
//        console.log(messageEvent);
        if (this.eventManager) {
            this.eventManager.$emit('message', messageEvent.data);
        }
    }

    async predict(outputCanvas) {
        var data = this.opts;
        var transfer = null;

        if (!this.output) {
            this.output = outputCanvas.transferControlToOffscreen();
            data.canvas = this.output;
            transfer = [this.output];
        } else {
            data.canvas = null;
        }
//        console.log(data);
//        console.log(transfer);
        this.Worker.postMessage(data, transfer);
    }

    createContext(canvas) {
        this.ctx = canvas.getContext('2d');
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
    async backgroudPredict(outputCanvas) {
        postMessage('Loading Models...');
        await this._loadModels();
        console.log(this.tf.memory());

        if (outputCanvas) {
            this.createContext(outputCanvas);
        }
        if (this.ctx) {

            var styles = this.opts.styleData;
            var source = this.opts.sourceData[0];
            var styleNet = this.models[this.opts.styleModel.name];
            var transformerNet = this.models[this.opts.transformerModel.name];
            // unit of overall ratios (1%)
            var ratioUnit = styles.reduce((accumulator, currentValue) => {
                if (accumulator.ratio) {
                    return currentValue.ratio;
                } else {
                    return accumulator + (currentValue.ratio);
                }
            });

            var bottlenecks = [],
                combinedBottleneck = null,
                styled;

            // await this.tf.nextFrame();
            postMessage('Stylizing image...');
            for(var i = 0, max = styles.length; i < max; i++) {
                postMessage(`Generating 100D style representation of image #${i}`);
                // await this.tf.nextFrame();

                bottlenecks[i] = await this.tf.tidy(() => {
                    return styleNet.predict(this.tf.browser.fromPixels(styles[i].resampled).toFloat().div(this.tf.scalar(255)).expandDims());
                });
            }
            /**
            * @param {combined bottleneck} accumulator
            */
            combinedBottleneck = bottlenecks.reduce((accumulator, bottleneck, idx) => {
                console.log(ratioUnit);
                console.log(styles[idx].ratio * ratioUnit);
                var scaled = bottleneck.mul(this.tf.scalar(styles[idx].ratio * ratioUnit));
                if (accumulator.addStrict) {
                    postMessage('Adding styles...');
                    return accumulator.addStrict(scaled);
                }
                return scaled;
            });
            styled = await this.tf.tidy(() => {
                return transformerNet.predict([
                    this.tf.browser.fromPixels(source.resampled).toFloat().div(this.tf.scalar(255)).expandDims(),
                    combinedBottleneck
                ]).squeeze();
            });

            await this.tf.browser.toPixels(styled, outputCanvas);

            // Might wanna keep this around
            combinedBottleneck.dispose();
            for(var i = 0, max = bottlenecks.length; i < max; i++) {
                bottlenecks[i].dispose();
            }
            styled.dispose();
            console.log(this.tf.memory().numTensors);
            postMessage('done');
        }
    }
}
