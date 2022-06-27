const { merge } = require('webpack-merge');
const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const { getCommonPaths, setupBabel } = require('./lib');
const { webpackCommonConfig } = require('./webpack.common');
const importCwd = require('import-cwd');

// const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');

const { customProdConfig = {}, optimizeImage = true } = importCwd(
    './webpack-eject.js'
);
const { outputPath, publicPath, staticPath } = getCommonPaths();

const config = {
    mode: 'production',
    devtool: 'hidden-source-map',
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
                extractComments: false,
                parallel: true,
                terserOptions: {
                    output: {
                        comments: false
                    }
                }
            })
            // optimizeImage &&
            //     new ImageMinimizerPlugin({
            //         minimizer: {
            //             implementation: ImageMinimizerPlugin.imageminMinify,
            //             options: {
            //                 // Lossless optimization with custom option
            //                 // Feel free to experiment with options for better result for you
            //                 plugins: [
            //                     ['gifsicle', { interlaced: true }],
            //                     ['jpegtran', { progressive: true }],
            //                     ['pngquant', { quality: [0.5, 0.6] }],
            //                     // Svgo configuration here https://github.com/svg/svgo#configuration
            //                     [
            //                         'svgo',
            //                         {
            //                             plugins: [
            //                                 {
            //                                     name: 'preset-default'
            //                                 },
            //                                 {
            //                                     name: 'removeViewBox',
            //                                     active: false
            //                                 },
            //                                 {
            //                                     name:
            //                                         'addAttributesToSVGElement',
            //                                     params: {
            //                                         attributes: [
            //                                             {
            //                                                 xmlns:
            //                                                     'http://www.w3.org/2000/svg'
            //                                             }
            //                                         ]
            //                                     }
            //                                 }
            //                             ]
            //                         }
            //                     ]
            //                 ]
            //             }
            //         }
            //     })
        ],
        usedExports: true,
        splitChunks: {
            chunks: 'all',
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendors',
                    chunks: 'all'
                }
            }
        }
    },
    module: {
        rules: [
            // .ts, .tsx
            {
                test: /\.(js|jsx|ts|tsx)$/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            cacheCompression: false,
                            cacheDirectory: true,
                            ...setupBabel('prod')
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
                    info: { minimized: true },
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
                minifyJS: false,
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
