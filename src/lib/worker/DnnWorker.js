
import Dnn from '../DeepNet.js';
import AppWorker from './AppWorker';


export default class DnnWorker extends AppWorker {

    constructor(worker) {
        super(worker);
        this.canvas = null;
        this.net = null;
    }

    initMessage() {
        super.initMessage(new OffscreenCanvas(0,0));
    }

    /**
     *
     * @param {Tensorflow} v
     * @returns {undefined}
     */
    set tf(v) {
        this._tf = v;
    }

    async styleMessage(data) {
//        await tf.ready;
        if (!this._tf) {
            postMessage('Error. tensorflow not set!');
            return;
        }
        postMessage('start');

        if (!this.net) {
            this.net = new Dnn(data, this._tf);
        } else {
            this.net.updateData(data);
        }

        if (this.canvas && this.net) {
            await this.net.predict(this.canvas);
            postMessage('done');
        }

    }
}