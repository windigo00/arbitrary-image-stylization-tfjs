
var canvas = null;
var ctx = null;
onmessage = function (e) {
    if (e.data.canvas) {
        canvas = e.data.canvas;
        createContext(e.data.canvas);
    }
    if (ctx) {
        let aspect = e.data.image.height / e.data.image.width;
        let width = e.data.size;
        let height = e.data.size * (e.data.square ? 1.0 : aspect);
        canvas.width = width;
        canvas.height = height;
        ctx.imageSmoothingEnabled = e.data.smooth;
        ctx.drawImage(
            e.data.image,
            0, 0,
            e.data.image.width,
            e.data.image.height,
            0, 0,
            width,
            height
        );
    }
};

function createContext(canvas) {
    ctx = canvas.getContext('2d');

}