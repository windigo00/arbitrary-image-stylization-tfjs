import SamplerWorker from '../lib/worker/SamplerWorker';

//const canvas = null;
var worker = null;

addEventListener('message', event => {

    var data = event.data;
    if (!worker) {
        worker = new SamplerWorker;
    }
    worker.handle(data.event, data.data);
});
