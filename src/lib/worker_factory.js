
import SamplerWorker from './worker/sampler';
import DnnWorker from './worker/dnn';

export default class WorkerFactory {

    static getWorker(name, onmessageCallback, onerrorCallback) {
        let worker;
        switch (name) {
            case 'sampler':
                worker = new SamplerWorker(new Worker('../data/worker.js', { type: 'module' }));
            break;

            case 'dnn':
                worker = new DnnWorker(new Worker('../dnn/worker.js', { type: 'module' }));
            break;

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