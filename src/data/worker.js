
var canvas = null;
var ctx = null;
onmessage = function (e) {
    switch (e.data.event) {
        case 'init':
            if (e.data.canvas) {
                canvas = e.data.canvas;
                createContext();
                postMessage({event: 'initialized'});
            } else {
                postMessage({event: 'error', message: "canvas not supplied"});
            }
        break;

        case 'render':
            if (ctx) {
                let rendered = renderImage(e.data.image, e.data.size, e.data.square, e.data.smooth);
                postMessage({event: 'change', image: rendered});
            } else {
                postMessage({event: 'error', message: "context not created"});
            }
        break;

        default:
            postMessage({event: 'error', message: `Event "${e.data.event}" not defined!`});
        break;

    }
};

function createContext() {
    ctx = canvas.getContext('2d');
}

function renderImage(image, size, square, smooth) {
    let aspect = image.height / image.width;
    let width = size;
    let height = size * (square ? 1.0 : aspect);
    canvas.width = width;
    canvas.height = height;
    ctx.imageSmoothingEnabled = smooth;
    ctx.drawImage(image, 0, 0, image.width, image.height, 0, 0, width, height);

    return ctx.getImageData(0, 0, width, height);
}
