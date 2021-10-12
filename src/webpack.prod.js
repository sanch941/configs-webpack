const { merge } = require('webpack-merge');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const { getCommonPaths } = require('./lib.js');

module.exports.initWebpackProd = ({ paths, webpackCommon, rootDir }) => {
    const { outputPath, publicPath = '/' } = paths;
    const { commonStaticPath } = getCommonPaths(rootDir);

    return merge(webpackCommon, {
        mode: 'production',
        devtool: 'hidden-source-map',
        node: {
            // workaround for webpack-dev-server issue
            // https://github.com/webpack/webpack-dev-server/issues/60#issuecomment-103411179
            fs: 'empty',
            net: 'empty'
        },
        target: 'web',
        output: {
            path: outputPath,
            publicPath,
            filename: '[contenthash].js',
            chunkFilename: '[name].[contenthash].js'
        },
        optimization: {
            minimize: true,
            minimizer: [
                new TerserPlugin({
                    parallel: true,
                    sourceMap: true,
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
                chunks: 'async',
                minSize: 30000,
                maxSize: 0,
                minChunks: 1,
                maxAsyncRequests: 5,
                maxInitialRequests: 3,
                automaticNameDelimiter: '~',
                automaticNameMaxLength: 30,
                name: true,
                cacheGroups: {
                    vendor: {
                        // node_modules配下のモジュールをバンドル対象とする
                        test: /node_modules/,
                        name: 'vendor',
                        chunks: 'initial',
                        enforce: true
                    },
                    default: {
                        minChunks: 2,
                        priority: -20,
                        reuseExistingChunk: true
                    }
                }
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
                template: path.join(commonStaticPath, 'index.ejs'),
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
    });
};
