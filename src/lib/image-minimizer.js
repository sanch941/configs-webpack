const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');

const imageMinimizer = new ImageMinimizerPlugin({
    deleteOriginalAssets: false,
    minimizer: {
        implementation: ImageMinimizerPlugin.squooshMinify
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
    ]
});

module.exports.imageMinimizer = imageMinimizer;
