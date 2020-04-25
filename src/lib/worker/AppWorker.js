class AppWorker {

    constructor(worker) {
        /**
         * worker offscreen canvas
         */
        this.canvas = null;
        if (worker) {
            this.worker = worker;
            this.worker.onerror = console.log;
        }
    }
    /**
     * set onMessage listener
     */
    set MessageCallback(fnc) {
        this.worker.onmessage = fnc;
    }
    /**
     * set onError listener
     */
    set ErrorCallback(fnc) {
        this.worker.onerror = fnc;
    }

    /**
     * postMessage
     */
    post(name, data = [], transfer = null) {
        var that = this;
//        return new Promise((resolve, reject) => {
//            console.log(name);
//            that.worker.onmessage = event => {
//                console.log(event);
//                resolve(event.data)
//            }
//            that.worker.onerror = e => {
//                console.error(`Error: Line ${e.lineno} in ${e.filename}: ${e.message}`)
//                reject(e)
//            }
        that.worker.postMessage({ event: name, data: data }, transfer);
//        })
    }
    /**
     *
     */
    handle(event, data) {
        this[event+'Message'].apply(this, [data]);
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
     * @param {type} canvas
     * @returns {undefined}
     */
    initMessage(canvas) {
        if (canvas && canvas.getContext) {
            this.canvas = canvas;
            this.ctx = this.canvas.getContext('2d');
            postMessage({event: 'initialized'});
        } else {
            postMessage({event: 'error', message: "canvas not supplied"});
        }
    }

    getCanvas() {
        if (!this.canvas) {
            this.canvas = new OffscreenCanvas(0,0);
        }
        return this.canvas;
    }

    /**
     *
     * @param {Event} e
     * @returns {undefined}
     */
    errorMessage(e) {
        postMessage({event: 'error', message: `Event "${e.data.event}" not defined!`});
    }

}

export default AppWorker;