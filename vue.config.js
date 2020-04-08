const WorkerPlugin = require('worker-plugin');

module.exports = {
    publicPath: '',
    pages: {
        index: {
            entry: 'src/main.js'
        },
        test: {
            entry: 'src/worker_test.js'
        }
    },

    configureWebpack: {
        output: {
            globalObject: "self"
        },
        plugins: [
            new WorkerPlugin()
        ]
    },

    chainWebpack: config => {
        // WASM Loader
        config.module
            .rule('wasm')
            .test(/\.wasm$/i)
            .type('javascript/auto')
            .use('file-loader')
                .loader('file-loader')
                .options({
                    publicPath: "/"
                })
                .end()
    }
}