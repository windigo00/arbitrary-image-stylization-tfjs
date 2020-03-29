//import imageStored from './stored/style.js';
const imageStored = [];
//import imageRandom from './random/links.js';
const imageRandom = [];
// get names from paths
const imageNamesRandom = imageRandom.map(e => {
    return e.match(/\/([^\/\.]+)\.jpg/)[1].replace(/\-/g, ' ');
})

import Types from './types.js';
/**
 * App data container
 *
 */
export default {
    model : {
        style: 'mobilenet',
        transformer: 'separable'
    },
    models : {
        style: {
            mobilenet: {
                name : 'style_mobilenet',
                model: 'saved_models/style_js/model.json',
                title: '[Fast] Distilled MobileNet style model (9.6MB)'
            },
            inception: {
                name : 'style_inception',
                model: 'saved_models/style_inception_js/model.json',
                title: '[High quality] Original Inceptionv3 style model (36.3MB)'
            }
        },
        transformer: {
            separable: {
                name : 'transformer_separable',
                model: 'saved_models/transformer_separable_js/model.json',
                title: '[Fast] Separable_conv2d transformer (2.4MB)'
            },
            original: {
                name : 'transformer_original',
                model: 'saved_models/transformer_js/model.json',
                title: '[High quality] Original transformer model (7.9MB)'
            }
        }
    },

    source: {
        values: [
            Types.ImageData
        ],

        options: {
            images: {
                stored: Object.assign(Types.ImageSourceData, {
                    items: imageStored,
                    names: imageStored
                }),
                random: Object.assign(Types.ImageSourceData, {
                    itemsSrc: imageRandom,
                    namesSrc: imageNamesRandom
                }),
                file: Types.ImageSourceData,
                camera: Types.ImageSourceData
            }
        }
    },

    style: {
        values: [
            Types.ImageData
        ],

        options: {
            images: {
                stored: Object.assign(Types.ImageSourceData, {
                    items: imageStored,
                    names: imageStored
                }),
                random: Object.assign(Types.ImageSourceData, {
                    itemsSrc: imageRandom,
                    namesSrc: imageNamesRandom
                }),
                file: Types.ImageSourceData,
                camera: Types.ImageSourceData

            }
        }
    }

};