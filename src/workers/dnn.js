
//import * as tf from '@tensorflow/tfjs';
const tf = 'a';
import DnnWorker from '../lib/worker/DnnWorker';

var worker = null;

addEventListener('message', event => {

    var data = event.data;
    if (!worker) {
        worker = new DnnWorker;
        worker.tf = tf;
    }
    worker.handle(data.event, data.data);
});

export default tf;