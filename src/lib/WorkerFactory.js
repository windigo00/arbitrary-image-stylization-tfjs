
import SamplerWorker from './worker/SamplerWorker';
import DnnWorker     from './worker/DnnWorker';

export default class WorkerFactory {

    static getWorker(name, onmessageCallback, onerrorCallback) {
        let worker;
        switch (name) {
            case 'sampler':
                worker = new SamplerWorker(new Worker('../workers/sampler.js', { type: 'module' }));
            break;

            case 'dnn_cpu'    : worker = new DnnWorker(new Worker('../workers/dnn_backend/cpu.js',  { type: 'module' })); break;
            case 'dnn_gpu'    : worker = new DnnWorker(new Worker('../workers/dnn_backend/gpu.js',  { type: 'module' })); break;
            case 'dnn_wasm'   : worker = new DnnWorker(new Worker('../workers/dnn_backend/wasm.js', { type: 'module' })); break;
            case 'dnn_default': worker = new DnnWorker(new Worker('../workers/dnn_backend/default.js', { type: 'module' })); break;

            default:
                new Error(`unknown worker type "${name}"!`);
            break;
        }
        if (!onmessageCallback) {
            new Error('onMessage callback has to be specified!');
        }
        worker.MessageCallback = onmessageCallback;

        if (onerrorCallback) {
            worker.ErrorCallback = onerrorCallback;
        }
        return worker;
    }
}