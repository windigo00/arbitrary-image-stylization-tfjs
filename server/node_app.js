//const tf = require('@tensorflow/tfjs-node-gpu');
const tf = require('@tensorflow/tfjs-node');
const Dnn = require('../src/lib/DeepNetNode');

class App {
    constructor() {
        // Train a simple model:
//        this.model = tf.sequential();
//        this.model.add(tf.layers.dense({units: 1000, activation: 'relu', inputShape: [100]}));
//        this.model.add(tf.layers.dense({units: 1, activation: 'linear'}));
//        this.model.compile({optimizer: 'sgd', loss: 'meanSquaredError'});
//
//        this.ys = tf.randomNormal([1000, 1]);

    }

//    train(io, data) {
//        io.emit('start');
//        console.log(data);
//        const xs = tf.randomNormal([1000, 100]);
//
//        this.model.fit(xs, this.ys, {
//            epochs: 1000,
//            callbacks: {
//                onEpochEnd: (epoch, log) => io.emit('progress', `Epoch ${epoch}: loss = ${log.loss}`)
//            }
//        });
//    }

    predict(io, data) {
        io.emit('start');

        if (!this.dnn) this.dnn = new Dnn(data, tf);
        this.dnn.predict(io, data)
                .then(e => io.emit('done'))
                .catch(console.log);

    }
}

module.exports = App;