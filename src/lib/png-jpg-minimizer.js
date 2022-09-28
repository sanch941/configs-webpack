const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');

const pngJpgMinimizer = new ImageMinimizerPlugin({
    deleteOriginalAssets: false,
    minimizer: {
        implementation: ImageMinimizerPlugin.squooshMinify,
        // Options
        options: {
            encodeOptions: {
                mozjpeg: {
                    // That setting might be close to lossless, but it’s not guaranteed
                    // https://github.com/GoogleChromeLabs/squoosh/issues/85
                    quality: 100
                }
            }
        }
    },
    generator: [
        {
            type: 'asset',
            // You can apply generator using `?as=webp`, you can use any name and provide more options
            preset: 'webp',
            implementation: ImageMinimizerPlugin.squooshGenerate,
            options: {
                encodeOptions: {
                    webp: {
                        quality: 90
                    }
                }
            }
        },
        {
            type: 'asset',
            // You can apply generator using `?as=avif`, you can use any name and provide more options
            preset: 'avif',
            implementation: ImageMinimizerPlugin.squooshGenerate,
            options: {
                encodeOptions: {
                    avif: {
                        cqLevel: 33
                    }
                }
            }
        }
    ],
    test: /\.(jpe?g|png)$/i
});

module.exports.pngJpgMinimizer = pngJpgMinimizer;
