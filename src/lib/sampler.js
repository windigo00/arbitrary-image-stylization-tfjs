
import Worker from './worker/sampler';

/**
 * Handling image operations
 */
export default class Sampler {

    constructor() {
        this.image = null;
        this.worker = new Worker;
    }

    init(canvas) {
        this.image = canvas.transferControlToOffscreen();
        this.worker.postMessage('init', [this.image], [this.image]);
    }

}