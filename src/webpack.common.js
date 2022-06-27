const webpack = require('webpack');
const path = require('path');
const Dotenv = require('dotenv-webpack');
const { setupAliases, getCommonPaths, rootDir } = require('./lib');
const importCwd = require('import-cwd');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
    .BundleAnalyzerPlugin;

const analyzeBundle = process.env.ANALYZE_BUNDLE === 'true';
const isDev = process.env.NODE_ENV !== 'production';
const { aliases, customCommonConfig = {} } = importCwd('./webpack-eject.js');
const { sourcePath } = getCommonPaths();

module.exports.webpackCommonConfig = {
    context: rootDir,
    entry: {
        app: ['./src/main.tsx']
    },
    target: ['web', 'es5'],
    resolve: {
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.d.ts'],
        alias: {
            ...setupAliases(sourcePath, aliases)
        }
    },
    cache: {
        type: 'filesystem'
    },
    plugins: [
        new webpack.DefinePlugin({
            _DEV_: isDev,
            _API_URL_: JSON.stringify(process.env.API_URL),
            _STRAPI_URL_: JSON.stringify(process.env.STRAPI_URL)
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
            },
            {
                test: /\.(png|jpe?g|gif|svg|webp)$/i,
                exclude: /\.inline.svg$/,
                type: 'asset'
            }
        ]
    },
    ...customCommonConfig
};
