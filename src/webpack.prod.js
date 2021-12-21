const { merge } = require('webpack-merge');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const { getCommonPaths } = require('./lib');
const { webpackCommonConfig } = require('./webpack.common');
const importCwd = require('import-cwd');

const { customProdConfig = {} } = importCwd('./webpack-eject.js');
const { outputPath, publicPath, staticPath } = getCommonPaths();

const config = {
    mode: 'production',
    devtool: 'hidden-source-map',
    target: 'web',
    output: {
        path: outputPath,
        publicPath,
        filename: '[name].[contenthash].js',
        chunkFilename: '[name].[contenthash].js'
    },
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                parallel: true,
                terserOptions: {
                    toplevel: true,
                    mangle: {
                        keep_classnames: true,
                        keep_fnames: true
                    },
                    output: {
                        comments: false
                    }
                }
            })
        ],
        usedExports: true,
        splitChunks: {
            chunks: 'all'
        }
    },
    module: {
        rules: [
            // .ts, .tsx
            {
                test: /\.(js|jsx|ts|tsx)$/,
                exclude: /(?:@?babel(?:\/|\{1,2}|-).+)|regenerator-runtime|core-js/,
                use: [
                    {
                        loader: 'babel-loader'
                    }
                ]
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
                                return '[contenthash].[ext]';
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
        new CleanWebpackPlugin(),
        new CopyPlugin({
            patterns: [
                {
                    from: 'src/public',
                    globOptions: {
                        ignore: ['**/*index.ejs']
                    }
                }
            ]
        }),
        new HtmlWebpackPlugin({
            template: path.join(staticPath, 'index.ejs'),
            inject: 'body',
            scriptLoading: 'blocking',
            minify: {
                minifyJS: true,
                minifyCSS: true,
                removeComments: true,
                useShortDoctype: true,
                collapseWhitespace: true,
                collapseInlineTagWhitespace: true
            }
        }),
        new CompressionPlugin({
            exclude: /.map$/
        })
    ],
    performance: {
        hints: false
    }
};

module.exports = merge(webpackCommonConfig, config, customProdConfig);
