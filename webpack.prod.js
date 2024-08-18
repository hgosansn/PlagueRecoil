const { merge } = require('webpack-merge');
const common = require('./webpack.config.js');
const TerserPlugin = require('terser-webpack-plugin');
const env = require('./environment');
const path = require('path');

prod = true;

module.exports = merge(common, {
    mode: 'production',
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                extractComments: false,
                terserOptions: {
                    compress: true,
                    mangle: true,
                },
            }),
        ],
    },
    output: {
        ...common.output,
        filename: '[name].[chunkhash].js', // Enable cache-busting
        path: path.resolve(__dirname, 'dist'),
        clean: true,
    },
});
