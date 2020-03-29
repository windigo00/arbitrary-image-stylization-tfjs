//importScripts('@tensorflow/tfjs');
//import * as tf from '@tensorflow/tfjs';
const tf = {};
//import * as tfGpu from '@tensorflow/tfjs-backend-webgpu';
// import * as tfWASM from '@tensorflow/tfjs-backend-wasm';
// tfWASM.setWasmPath("https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-backend-wasm/dist/tf-backend-wasm.js");

//tf.ENV.set('WEBGL_PACK', false);  // This needs to be done otherwise things run very slow v1.0.4

import Dnn from './dnn.js';
// (async() => {
//     await tf.ready
//     // tf.setBackend('wasm');
//
// })()


var canvas = null;
/**
 *
 * @type Dnn
 */
var net = null;

onmessage = async function (e) {
    await tf.ready;
    postMessage('start');
    if (e.data.canvas) {
        canvas = e.data.canvas;
    }

    if (!net) {
        net = new Dnn(e.data, tf);
    } else {
        net.updateData(e.data);
    }

    if (canvas && net) {
        await net.backgroudPredict(canvas);
        postMessage('done');
    }
}
