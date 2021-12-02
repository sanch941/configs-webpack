const path = require('path');
const rootDir = path.join(__dirname, '../');

const sourcePath = path.join(rootDir, 'public');
const outputPath = path.join(rootDir, 'dist');
const publicPath = '/public/';

const assetsPath = path.join(sourcePath, 'assets');

const paths = {
    sourcePath,
    outputPath,
    publicPath,
    staticPath: sourcePath,
    assetsPath
};

module.exports = {
    rootDir,
    paths
};
