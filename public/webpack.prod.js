const { rootDir, paths } = require('./lib.js');
const { initWebpackProd } = require('../src/index');
const { webpackCommon } = require('./webpack.common');
const { merge } = require('webpack-merge');

const webpackProdOptions = initWebpackProd({ rootDir, paths, webpackCommon });

const config = merge(webpackProdOptions, {
    entry: {
        app: ['./src/main.tsx']
    }
});

module.exports = config;
