
const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

let isDevelopment = process.env.NODE_ENV === 'production' ? false : true;
module.exports = {
    mode: !isDevelopment ? 'production' : 'development',
    devtool: 'inline-source-map',
    entry: {
        main: __dirname + '/src/main.js',
        worker: __dirname + '/src/worker.js'
    },
    output: {
        path: path.resolve(__dirname, 'dist')
    },
    plugins: [
        new VueLoaderPlugin(),
        new HtmlWebpackPlugin({
            template: __dirname + '/public/index.html'
        }),
        new CopyPlugin([
            {from: __dirname + '/saved_models', to: __dirname + '/dist/saved_models'},
            {from: __dirname + '/images', to: __dirname + '/dist/images'}
        ])
    ],

    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            {
                test: /\.(png|jpg)$/,
                loader: 'url-loader'
            },
            {
                test: /\.css$/,
                use: [
                    'vue-style-loader',
                    'css-loader'
                ]
            },
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            }
        ]
    },
    resolve: {
        alias: {
            'vue$': 'vue/dist/vue.esm.js'
        },
        extensions: [ '.tsx', '.ts', '.js', '.jsx']
    }
};