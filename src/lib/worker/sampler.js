
import AppWorker from '../worker';

export default class SamplerWorker extends AppWorker {

    renderMessage(data) {
        if (!data || (data && !data.image)) {
            postMessage({event: 'error', message: "image not supplied"});
            return;
        }

        var ctx = this.canvas.getContext('2d');
        if (ctx) {
            let aspect = data.image.height / data.image.width;
            let width = data.size;
            let height = data.size * (data.square ? 1.0 : aspect);
            this.canvas.width = width;
            this.canvas.height = height;
            ctx.imageSmoothingEnabled = data.smooth;
            ctx.drawImage(data.image, 0, 0, data.image.width, data.image.height, 0, 0, width, height);

            let rendered = ctx.getImageData(0, 0, width, height);

            postMessage({event: 'change', image: rendered});
        } else {
            postMessage({event: 'error', message: "context not created"});
        }
    }
}