const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const Dotenv = require('dotenv-webpack');
module.exports = merge(common, {
    mode: 'production',
    output: {
        publicPath: '/'
    },
    plugins: [
        new Dotenv({
            path: './src/front/.env',
            systemvars: true
        })
    ]
});
