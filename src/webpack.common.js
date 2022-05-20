const webpack = require('webpack');
const path = require('path');
const Dotenv = require('dotenv-webpack');
const { setupAliases, getCommonPaths, rootDir } = require('./lib');
const importCwd = require('import-cwd');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
    .BundleAnalyzerPlugin;

const isDev = process.env.NODE_ENV !== 'production';
const { aliases, customCommonConfig = {}, analyzeBundle } = importCwd(
    './webpack-eject.js'
);
const { sourcePath } = getCommonPaths();

module.exports.webpackCommonConfig = {
    context: rootDir,
    entry: {
        app: ['./src/main.tsx']
    },
    target: 'web',
    resolve: {
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.d.ts'],
        alias: {
            ...setupAliases(sourcePath, aliases)
        }
    },
    plugins: [
        new webpack.DefinePlugin({
            _DEV_: isDev,
            _API_URL_: JSON.stringify(process.env.API_URL),
            _STRAPI_URL: JSON.stringify(process.env.STRAPI_URL)
        }),
        new Dotenv({
            path: path.join(rootDir, '.env')
        }),
        analyzeBundle ? new BundleAnalyzerPlugin() : false
    ].filter(Boolean),
    module: {
        rules: [
            { test: /\.html$/, type: 'asset/resource' },
            {
                test: /\.(woff|woff2|eot|ttf|otf|mp4)$/,
                type: 'asset/resource'
            },
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.inline.svg$/,
                use: [
                    {
                        loader: 'babel-loader'
                    },
                    {
                        loader: 'react-svg-loader',
                        options: {
                            jsx: true // true outputs JSX tags
                        }
                    }
                ]
            }
        ]
    },
    ...customCommonConfig
};
