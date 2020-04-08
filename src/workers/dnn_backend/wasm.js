
import tf from '../dnn';

import * as tfWASM from '@tensorflow/tfjs-backend-wasm';
import wasmPath from '@tensorflow/tfjs-backend-wasm/dist/tfjs-backend-wasm.wasm';
tfWASM.setWasmPath(wasmPath);
// tfWASM.setWasmPath("https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-backend-wasm/dist/tf-backend-wasm.js");

 (async() => {
    await tf.ready();
    tf.setBackend('wasm').then(() => {
        console.log('running web assemply');
    });
 })();