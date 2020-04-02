import DnnWorker from '../lib/worker/dnn';

var worker = null;

addEventListener('message', event => {

    var data = event.data;
    if (!worker) {
        worker = new DnnWorker;
    }
    worker.handle(data.event, data.data);
});