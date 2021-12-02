const path = require('path');
const { rootDir, paths } = require('./lib.js');
require('dotenv').config({ path: path.join(rootDir, '.env') });
const { merge } = require('webpack-merge');
const { initWebpackDev } = require('../src/index');
const { webpackCommon } = require('./webpack.common');

const webpackDevOptions = initWebpackDev({ rootDir, paths, webpackCommon });

const config = merge(webpackDevOptions, {
    entry: {
        app: ['./public/main.tsx']
    }
});

module.exports = config;
