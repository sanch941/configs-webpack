const path = require('path');
const webpack = require('webpack');

module.exports.initWebpackLibrary = (rootDir, dependencies) => ({
    mode: 'development',
    devtool: 'eval',
    context: rootDir,
    resolve: {
        extensions: ['.js', '.jsx', '.json', '.less', '.css']
    },
    entry: {
        library: Object.keys(dependencies || {})
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
});
