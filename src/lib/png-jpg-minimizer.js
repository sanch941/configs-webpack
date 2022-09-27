const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');

const pngJpgMinimizer = new ImageMinimizerPlugin({
    deleteOriginalAssets: false,
    minimizer: {
        implementation: ImageMinimizerPlugin.sharpMinify,
        // Options
        options: {
            encodeOptions: {
                jpeg: {
                    quality: 90
                },
                png: {
                    compressionLevel: 9,
                    adaptiveFiltering: true,
                    force: true
                }
            }
        }
    },
    generator: [
        {
            type: 'asset',
            // You can apply generator using `?as=webp`, you can use any name and provide more options
            preset: 'webp',
            implementation: ImageMinimizerPlugin.sharpGenerate,
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
            implementation: ImageMinimizerPlugin.sharpGenerate,
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
