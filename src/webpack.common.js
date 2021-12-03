const webpack = require('webpack');
const path = require('path');
const Dotenv = require('dotenv-webpack');
const { setupAliases, getCommonPaths, rootDir } = require('./lib');
const importCwd = require('import-cwd');

const isDev = process.env.NODE_ENV !== 'production';
const { aliases, libPath, customLibConfig = {} } = importCwd(
    './webpack-eject.js'
);
const { sourcePath } = getCommonPaths();

module.exports.webpackCommonConfig = {
    context: rootDir,
    target: 'web',
    resolve: {
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.d.ts'],
        alias: {
            'react-dom': '@hot-loader/react-dom',
            '@lib': path.join(rootDir, `${libPath || 'src/lib'}`),
            ...setupAliases(sourcePath, aliases)
        }
    },
    plugins: [
        new webpack.DefinePlugin({
            _DEV_: isDev,
            _API_URL_: JSON.stringify(process.env.API_URL)
        }),
        new Dotenv({
            path: path.join(rootDir, '.env')
        })
    ],
    ...customLibConfig
};
