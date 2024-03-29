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
const { svgMinimizer } = require('./lib/svg-minimizer');
const { pngJpgMinimizer } = require('./lib/png-jpg-minimizer');

const { customProdConfig = {}, optimizeImage } = importCwd(
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
            }),
            optimizeImage && svgMinimizer,
            optimizeImage && pngJpgMinimizer
        ].filter(Boolean),
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
        new CompressionPlugin({
            exclude: /.map$/
        })
    ],
    performance: {
        hints: false
    }
};

module.exports = merge(webpackCommonConfig, config, customProdConfig);
