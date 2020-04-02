//importScripts('@tensorflow/tfjs');
import * as tf from '@tensorflow/tfjs';
//const tf = {};
//import * as tfGpu from '@tensorflow/tfjs-backend-webgpu';
// import * as tfWASM from '@tensorflow/tfjs-backend-wasm';
// import wasmPath from '../../../node_modules/@tensorflow/tfjs-backend-wasm/dist/tfjs-backend-wasm.wasm';
// tfWASM.setWasmPath(wasmPath);
// tfWASM.setWasmPath("https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-backend-wasm/dist/tf-backend-wasm.js");

tf.ENV.set('WEBGL_PACK', false);  // This needs to be done otherwise things run very slow v1.0.4

import Dnn from '../../dnn/dnn.js';
import AppWorker from '../worker';
// (async() => {
//    await tf.ready
//    tf.setBackend('wasm');
//
// })()

export default class DnnWorker extends AppWorker {

    constructor(worker) {
        super(worker);
        this.canvas = null;
        this.net = null;
    }

    initMessage() {
        super.initMessage(new OffscreenCanvas(0,0));
    }

    async styleMessage(data) {
//        await tf.ready;
        postMessage('start');

        if (!this.net) {
            this.net = new Dnn(data, tf);
        } else {
            this.net.updateData(data);
        }

        if (this.canvas && this.net) {
            await this.net.predict(this.canvas);
            postMessage('done');
        }

    }
}