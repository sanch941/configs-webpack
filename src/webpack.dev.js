const path = require('path');
const glob = require('glob');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const portFinderSync = require('portfinder-sync');
const { killOnCtrlC, getCommonPaths } = require('./lib.js');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

killOnCtrlC();

const { merge } = require('webpack-merge');
const webpack = require('webpack');
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin');

const tsIncludePatterns = ['src/**/*.d.ts'];

const addToFileDeps = {
    apply(compiler) {
        compiler.hooks.afterCompile.tap(
            'AddToFileDepsPlugin',
            (compilation) => {
                tsIncludePatterns
                    .reduce(
                        (filePaths, pattern) =>
                            filePaths.concat(glob.sync(pattern)),
                        []
                    )
                    .forEach((filePath) => {
                        compilation.fileDependencies.add(
                            path.resolve(filePath)
                        );
                    });
            }
        );
    }
};

module.exports.initWebpackDev = ({ paths, webpackCommon, rootDir }) => {
    const { outputPath } = paths;
    const { commonStaticPath, commonSourcePath } = getCommonPaths(rootDir);

    return merge(webpackCommon, {
        mode: 'development',
        devtool: 'cheap-module-eval-source-map',
        devServer: {
            contentBase: commonStaticPath,
            hot: true,
            inline: true,
            overlay: true,
            port: portFinderSync.getPort(3000),
            open: true,
            historyApiFallback: true,
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
            clientLogLevel: 'none'
        },
        node: {
            // workaround for webpack-dev-server issue
            // https://github.com/webpack/webpack-dev-server/issues/60#issuecomment-103411179
            fs: 'empty',
            net: 'empty'
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
                                plugins: ['react-hot-loader/babel']
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
            addToFileDeps,
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
                    files: path.join(commonSourcePath, '**/*.{ts,tsx}')
                }
            }),
            new HtmlWebpackPlugin({
                template: path.join(commonStaticPath, 'index.ejs')
            }),
            new webpack.DllReferencePlugin({
                context: rootDir,
                manifest: require(path.join(
                    rootDir,
                    'build/library/library.json'
                ))
            }),
            new AddAssetHtmlPlugin({
                filepath: require.resolve(
                    path.join(rootDir, 'build/library/library.dll.js')
                )
            })
        ],
        performance: {
            hints: false
        }
    });
};
