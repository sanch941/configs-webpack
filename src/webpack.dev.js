const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const portFinderSync = require('portfinder-sync');
const { getCommonPaths, setupBabel } = require('./lib.js');
const { webpackCommonConfig } = require('./webpack.common');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const { mergeWithRules } = require('webpack-merge');
const importCwd = require('import-cwd');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const openBrowser = require('react-dev-utils/openBrowser');

const { outputPath, staticPath } = getCommonPaths();
const { customDevConfig = {}, mergeDevRules = {} } = importCwd(
    './webpack-eject.js'
);
const reuseCurrentTab = process.env.REUSE_CURRENT_TAB === 'true';
const port = portFinderSync.getPort(3000);

const config = {
    mode: 'development',
    devtool: 'eval',
    devServer: {
        hot: true,
        port,
        open: !reuseCurrentTab,
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
        },
        onAfterSetupMiddleware: () => {
            reuseCurrentTab && openBrowser(`http://localhost:${port}`);
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
                        loader: 'babel-loader',
                        options: {
                            cacheCompression: false,
                            cacheDirectory: true,
                            ...setupBabel('dev')
                        }
                    }
                ],
                exclude: /node_modules/
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
            }
        }),
        new HtmlWebpackPlugin({
            template: path.join(staticPath, 'index.ejs')
        }),
        new ReactRefreshWebpackPlugin({
            overlay: false
        })
    ],
    performance: {
        hints: false
    }
};

module.exports = mergeWithRules({
    devServer: {
        proxy: {
            context: 'match',
            target: 'replace',
            changeOrigin: 'replace',
            pathRewrite: 'replace'
        }
    },
    ...mergeDevRules
})(webpackCommonConfig, config, customDevConfig);
