const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const portFinderSync = require('portfinder-sync');
const { getCommonPaths, rootDir } = require('./lib.js');
const { webpackCommonConfig } = require('./webpack.common');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const { merge } = require('webpack-merge');
const webpack = require('webpack');
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin');
const importCwd = require('import-cwd');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

const { sourcePath, outputPath, staticPath } = getCommonPaths();
const { customDevConfig = {} } = importCwd('./webpack-eject.js');

const config = {
    mode: 'development',
    devtool: 'eval',
    devServer: {
        hot: true,
        port: portFinderSync.getPort(3000),
        open: true,
        historyApiFallback: true,
        static: {
            directory: staticPath
        },
        compress: true,
        proxy: [
            {
                context: ['/tp-local-api'],
                target: process.env.PROXY_TARGET,
                pathRewrite: { '^/tp-local-api': '' }
            },
            {
                context: ['/tp-dev-api'],
                target: 'https://dev.api.tarlanpayments.kz',
                pathRewrite: { '^/tp-dev-api': '' },
                changeOrigin: true
            },
            {
                context: ['/tp-prod-api'],
                target: 'https://api.tarlanpayments.kz',
                pathRewrite: { '^/tp-prod-api': '' },
                changeOrigin: true
            }
        ],
        client: {
            logging: 'none',
            overlay: {
                errors: true,
                warnings: false
            }
        }
    },
    output: {
        path: outputPath,
        filename: '[name].bundle.js',
        publicPath: '/'
    },
    module: {
        rules: [
            // .ts, .tsx
            {
                test: /\.(ts|tsx)$/,
                use: [
                    {
                        loader: 'cache-loader',
                        options: {
                            cacheDirectory: path.resolve(
                                rootDir,
                                'node_modules/.cache/cache-loader'
                            )
                        }
                    },
                    'thread-loader',
                    {
                        loader: 'babel-loader',
                        options: {
                            plugins: ['react-refresh/babel']
                        }
                    }
                ],
                exclude: /node_modules/
            },
            { test: /\.html$/, use: 'html-loader' },
            {
                test: /\.(png|jpe?g|gif|svg)$/i,
                exclude: /\.inline.svg$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name() {
                                return '[path][name].[ext]';
                            },
                            esModule: false
                        }
                    }
                ]
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use: ['file-loader']
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
    plugins: [
        new ForkTsCheckerWebpackPlugin({
            typescript: {
                mode: 'write-references',
                diagnosticOptions: {
                    semantic: true,
                    syntactic: true
                }
            },

            eslint: {
                enabled: true,
                files: path.join(sourcePath, '**/*.{ts,tsx}')
            }
        }),
        new HtmlWebpackPlugin({
            template: path.join(staticPath, 'index.ejs')
        }),
        new webpack.DllReferencePlugin({
            context: rootDir,
            manifest: require(path.join(rootDir, 'build/library/library.json'))
        }),
        new AddAssetHtmlPlugin({
            filepath: require.resolve(
                path.join(rootDir, 'build/library/library.dll.js')
            )
        }),
        new ReactRefreshWebpackPlugin()
    ],
    performance: {
        hints: false
    }
};

module.exports = merge(webpackCommonConfig, config, customDevConfig);
