
class DeepNet {

    /**
     *
     * @param {Object} options
     * @param {Tensorflow} tf
     * @returns {DeepNet}
     */
    constructor(options, tf) {
        this.opts = options;

        if (tf) {
            this.tf = tf;
        }

        this.models = {
        };
    }
    /**
     *
     * @param {Object} options
     * @returns {undefined}
     */
    updateData(options) {
        this.opts = options;
    }
    /**
     *
     * @param {String} type
     * @returns {Boolean}
     */
    isModelLoaded(type) {
        var t = this.opts[type+'Model'];
        return this.models[t.name] != null;
    }

    /**
     *
     * @param {String} type
     * @param {Object} modelData
     * @returns {unresolved}
     */
    async loadModel(type, modelData) {
//        postMessage(' - '+ modelData.title);
        return await this.tf.loadGraphModel('../'+modelData.model);
    }

    async _loadModels() {
        if (!this.isModelLoaded('style')) {
//            postMessage(' - style');
            this.models[this.opts.styleModel.name] = await this.loadModel('style', this.opts.styleModel);
        }
        if (!this.isModelLoaded('transformer')) {
//            postMessage(' - transformer');
            this.models[this.opts.transformerModel.name] = await this.loadModel('transformer', this.opts.transformerModel);
        }
    }
//
    async predict(canvas) {
        this.canvas = canvas;
        postMessage('Loading Models...');
        await this._loadModels();

        var styles = this.opts.styleData;
        var source = this.opts.sourceData[0];
        var styleNet = this.models[this.opts.styleModel.name];
        var transformerNet = this.models[this.opts.transformerModel.name];
        // unit of overall ratios (1%)
        var ratioUnit = 0.0;
        for (let i = 0, max = styles.length; i < max; i++) {
            ratioUnit += styles[i].ratio;
        }
        let styled,
                styleBottleneck,
                combinedBottleneck;

        if (this.canvas) {
            try {

                await this.tf.nextFrame();

                combinedBottleneck = await this.tf.tidy(() => {
                    let combined,
                            scaled;

                    for (let i = 0, max = styles.length; i < max; i++) {
                        postMessage(`Generating 100D style representation of image #${i}`);

                        var bottleneck = this.tf.tidy(() => {
                            return styleNet.predict(this.tf.browser.fromPixels(styles[i].resampled).toFloat().div(this.tf.scalar(255)).expandDims());
                        });

                        var r = styles[i].ratio / ratioUnit

                        scaled = bottleneck.mul(this.tf.scalar(r));
                        if (combined) {
                            combined.add(scaled);
                        } else {
                            combined = scaled;
                        }
                    }

                    return combined;
                });

                styleBottleneck = combinedBottleneck;
                if (source.ratio !== 1.0) {
                    await this.tf.nextFrame();
                    const identityBottleneck = await this.tf.tidy(() => {
                        return styleNet.predict(this.tf.browser.fromPixels(source.resampled).toFloat().div(this.tf.scalar(255)).expandDims());
                    })
                    styleBottleneck = await this.tf.tidy(() => {
                        const styleBottleneckScaled = combinedBottleneck.mul(this.tf.scalar(source.ratio));
                        const identityBottleneckScaled = identityBottleneck.mul(this.tf.scalar(1.0 - source.ratio));
                        return styleBottleneckScaled.addStrict(identityBottleneckScaled);
                    })
                    identityBottleneck.dispose();
                }

                postMessage('Styling image...');

                styled = await this.tf.tidy(() => {
                    return transformerNet.predict([
                        this.tf.browser.fromPixels(source.resampled).toFloat().div(this.tf.scalar(255)).expandDims(),
                        styleBottleneck
                    ]).squeeze();
                });
            } catch (e) {
                postMessage({event: 'error', message: e});
                if (combinedBottleneck) {
                    combinedBottleneck.dispose();
                }
                return;
            }

            await this.tf.browser.toPixels(styled, this.canvas);

            // Might wanna keep this around

            let rendered = this.canvas.getContext('2d').getImageData(0, 0, this.canvas.width, this.canvas.height);
            combinedBottleneck.dispose();
            if (styleBottleneck) {
                styleBottleneck.dispose();
            }
            styled.dispose();
            postMessage({event: 'change', image: rendered});
        }
    }
}

export default DeepNet;