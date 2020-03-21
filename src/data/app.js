import imageSource from './stored/source.js';
import imageStyle  from './stored/style.js';

import imageLinks from './links.js';
// get names from paths
const linkNames = imageLinks.map(e => {
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
        style: [{
            name:'mobilenet',
            title: '[Fast] Distilled MobileNet style model (9.6MB)'
        },{
            name:'inception',
            title: '[High quality] Original Inceptionv3 style model (36.3MB)'
        }],
        transformer:[{
            name: 'separable',
            title: '[Fast] Separable_conv2d transformer (2.4MB)'
        },{
            name: 'original',
            title: '[High quality] Original transformer model (7.9MB)'
        }]
    },

    source: {
        values: Types.ImageData,

        options: {
            images: {
                stored: Object.assign(Types.ImageSourceData, {
                    items: imageSource,
                    names: imageSource
                }),
                random: Object.assign(Types.ImageSourceData, {
                    itemsSrc: imageLinks,
                    namesSrc: linkNames
                }),
                file: Types.ImageSourceData,
                camera: Types.ImageSourceData
            }
        }
    },

    style: {
        values: [
            Types.ImageData,
            Types.ImageData
        ],

        options: {
            images: {
                stored: Object.assign(Types.ImageSourceData, {
                    items: imageStyle,
                    names: imageStyle
                }),
                random: Object.assign(Types.ImageSourceData, {
                    itemsSrc: imageLinks,
                    namesSrc: linkNames
                }),
                file: Types.ImageSourceData,
                camera: Types.ImageSourceData

            }
        }
    }

};