const path = require('path');
const webpack = require('webpack');
const importCwd = require('import-cwd');
const { rootDir } = require('./lib');

const { customDependencies } = importCwd('./webpack-eject.js');
const { dependencies } = importCwd('./package.json');
const {
    ['react-imask']: val1,
    ['@sanch941/lib']: val2,
    ['slick-carousel']: val3,
    ...allDependencies
} = customDependencies || dependencies;

module.exports = {
    mode: 'development',
    devtool: 'eval',
    context: rootDir,
    resolve: {
        extensions: ['.js', '.jsx', '.json', '.less', '.css']
    },
    entry: {
        library: Object.keys(allDependencies || {})
    },
    output: {
        filename: '[name].dll.js',
        path: path.join(rootDir, 'build/library'),
        library: '[name]'
    },
    plugins: [
        new webpack.DllPlugin({
            name: '[name]',
            path: path.join(rootDir, 'build/library/[name].json'),
            entryOnly: true
        })
    ]
};
