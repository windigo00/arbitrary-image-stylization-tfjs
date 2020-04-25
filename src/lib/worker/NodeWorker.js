import AppWorker from './AppWorker';
import io from 'socket.io-client';
import * as tf from '@tensorflow/tfjs';

export default class NodeWorker extends AppWorker {

    constructor(type) {
        super();
        this.type = type;
        this.socket = io('http://localhost:8081');

        this.socket
            .on('start', e => {
                console.log('start');
                this.onmessage(e);
            })
            .on('progress', e => {
                console.log('progress');

                this.onmessage(e);
            })
            .on('change', e => {
                var that = this,
                    cnv  = this.getCanvas();
                tf.browser.toPixels(e.image, cnv).then(() => {
                    e.image = cnv.getContext('2d').getImageData(0, 0, cnv.width, cnv.height);
                    that.onmessage(e);
                });
                console.log('change');
            })
            .on('message', e => {
                console.log(e);
                this.onmessage(e);
            });
    }

    /**
     * set onMessage listener
     */
    set MessageCallback(fnc) {
        this.onmessage = fnc;
    }
    /**
     * set onError listener
     */
    set ErrorCallback(fnc) {
        this.onerror = fnc;
    }

    /**
     * postMessage
     */
    post(name, data = []) {
//        var that = this;
        this.socket.emit(`${name} message`, {event: name, data: data});
//        that.worker.postMessage({ event: name, data: data }, transfer);
    }
    /**
     *
     */
    handle(event, data) {
        this[event + 'Message'].apply(this, [data]);
    }

    terminate() {
        if (this.worker) {
            this.worker.terminate();
        }
    }
    //----------------------------
    //----- message handlers -----
    //----------------------------
    /**
     *
     * @returns {undefined}
     */
//    initMessage() {
//        if (canvas && canvas.getContext) {
//            this.canvas = canvas;
//            this.ctx = this.canvas.getContext('2d');
//            postMessage({event: 'initialized'});
//        } else {
//            postMessage({event: 'error', message: "canvas not supplied"});
//        }
//    }
    /**
     *
     * @param {Event} e
     * @returns {undefined}
     */
//    errorMessage(e) {
//        postMessage({event: 'error', message: `Event "${e.data.event}" not defined!`});
//    }

    prepareData(data) {
//        console.log(data);
        var ret = JSON.parse(JSON.stringify(data));

        tf.tidy(() => {
            ret.sourceData = ret.sourceData.map((e, i) => Object.assign(e, { resampled: tf.browser.fromPixels(data.sourceData[i].resampled).arraySync() }))
            ret.styleData  = ret.styleData.map ((e, i) => Object.assign(e, { resampled: tf.browser.fromPixels(data.styleData[i].resampled).arraySync() }))
        });
        return ret;
    }
}