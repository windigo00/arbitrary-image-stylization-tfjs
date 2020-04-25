
const fs = require('fs');
//const { createCanvas, createImageData } = require('canvas');

class DeepNetNode {

    /**
     *
     * @param {Object} options
     * @param {Tensorflow} tf
     * @returns {DeepNet}
     */
    constructor(options, tf) {
        this.opts = options;
        this.tf = tf;

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
        this.opts
        var t = this.opts[type + 'Model'];
        return this.models[t.name] != null;
    }

    /**
     *
     * @param {String} type
     * @param {Object} modelData
     * @returns {unresolved}
     */
    async loadModel(type, modelData) {
        this.io.emit('message', ' - ' + modelData.title);
        return await this.tf.loadGraphModel('http://localhost:8080/' + modelData.model).catch((e) => console.log(e));
    }

    async _loadModels() {
        if (!this.isModelLoaded('style')) {
//            this.io.emit('message', ' - style');
            this.models[this.opts.styleModel.name] = await this.loadModel('style', this.opts.styleModel);
        }
        if (!this.isModelLoaded('transformer')) {
//            this.io.emit('message', ' - transformer');
            this.models[this.opts.transformerModel.name] = await this.loadModel('transformer', this.opts.transformerModel);
        }
    }
//
    async predict(io, data) {
        this.io = io;
        this.io.emit('message', 'Loading Models...');
        await this._loadModels();
        var styles = this.opts.styleData,
            source = this.opts.sourceData[0],
            styleNet = this.models[this.opts.styleModel.name],
            transformerNet = this.models[this.opts.transformerModel.name],
            rendered,

            styled,
            styleBottleneck,
            combinedBottleneck,
            image,

            ratioUnit = 0.0; // unit of overall ratios (1%)
//console.log(source);
        for (let i = 0, max = styles.length; i < max; i++) {
            ratioUnit += styles[i].ratio;
        }

        try {

//            await this.tf.nextFrame();

            combinedBottleneck = await this.tf.tidy(() => {
                let combined,
                    scaled;

                for (let i = 0, max = styles.length; i < max; i++) {
                    this.io.emit('message', `Generating 100D style representation of image #${i}`);
                    var bottleneck = this.tf.tidy(() => {
                        return styleNet.predict(this.tf.tensor(styles[i].resampled).toFloat().div(this.tf.scalar(255)).expandDims());
                    });

                    var r = styles[i].ratio / ratioUnit;

                    scaled = bottleneck.mul(this.tf.scalar(r));
                    if (combined) {
                        combined.add(scaled);
                    } else {
                        combined = scaled;
                    }
                }
                return combined;
            });
//            image.dispose();

            styleBottleneck = combinedBottleneck;

            this.io.emit('message', 'Styling image...');

            styled = this.tf.tidy(() => {

                image = this.tf.tensor(source.resampled);

                if (source.ratio !== 1.0) {
    //                await this.tf.nextFrame();
                    const identityBottleneck = this.tf.tidy(() => {
                        return styleNet.predict(image.toFloat().div(this.tf.scalar(255)).expandDims());
                    })
                    styleBottleneck = this.tf.tidy(() => {
                        const styleBottleneckScaled = combinedBottleneck.mul(this.tf.scalar(source.ratio));
                        const identityBottleneckScaled = identityBottleneck.mul(this.tf.scalar(1.0 - source.ratio));
                        return styleBottleneckScaled.addStrict(identityBottleneckScaled);
                    })
                    identityBottleneck.dispose();
                }

                image = image.toFloat().div(this.tf.scalar(255)).expandDims();
                return transformerNet.predict([
                    image,
                    styleBottleneck
                ]).squeeze();
            });
            rendered = styled.arraySync();
//            this.io.emit('message', rendered);
//            console.log(rendered);
            await fs.writeFile('./out.png', rendered, this.showError);
//            await this.tf.browser.toPixels(styled, canvas).catch (e => { console.log(e) });
    //        ctx.drawImage(styled, 0, 0);
    //        rendered = ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        } catch (e) {
            this.io.emit('error', e);
            if (image) {
                image.dispose();
            }
            if (combinedBottleneck) {
                combinedBottleneck.dispose();
            }
            return;
        }


        // Might wanna keep this around
        image.dispose();
        combinedBottleneck.dispose();
        if (styleBottleneck) {
            styleBottleneck.dispose();
        }
        styled.dispose();
        this.io.emit('change', {
            event: 'change',
            image: rendered
        });
    }

    showError(err) {
        if (err) console.log(err);
        else console.log('The file has been saved!');
    }
}

module.exports = DeepNetNode;