const { initWebpackCommon } = require('./webpack.common');
const { initWebpackDev } = require('./webpack.dev');
const { initWebpackLibrary } = require('./webpack.library');
const { initWebpackProd } = require('./webpack.prod');

module.exports = {
    initWebpackLibrary,
    initWebpackDev,
    initWebpackProd,
    initWebpackCommon
};
