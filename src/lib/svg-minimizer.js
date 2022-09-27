const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');

const svgMinimizer = new ImageMinimizerPlugin({
    test: /\.(svg)$/i,
    minimizer: {
        implementation: ImageMinimizerPlugin.imageminMinify,
        options: {
            // Lossless optimization with custom option
            // Feel free to experiment with options for better result for you
            plugins: [
                // Svgo configuration here https://github.com/svg/svgo#configuration
                [
                    'svgo',
                    {
                        plugins: [
                            {
                                name: 'preset-default',
                                params: {
                                    overrides: {
                                        removeViewBox: false,
                                        addAttributesToSVGElement: {
                                            params: {
                                                attributes: [
                                                    {
                                                        xmlns:
                                                            'http://www.w3.org/2000/svg'
                                                    }
                                                ]
                                            }
                                        }
                                    }
                                }
                            }
                        ]
                    }
                ]
            ]
        }
    },
    generator: [
        {
            type: 'asset',
            preset: 'svg',
            implementation: ImageMinimizerPlugin.imageminGenerate,
            options: {
                // Lossless optimization with custom option
                // Feel free to experiment with options for better result for you
                plugins: [
                    // Svgo configuration here https://github.com/svg/svgo#configuration
                    [
                        'svgo',
                        {
                            plugins: [
                                {
                                    name: 'preset-default',
                                    params: {
                                        overrides: {
                                            removeViewBox: false,
                                            addAttributesToSVGElement: {
                                                params: {
                                                    attributes: [
                                                        {
                                                            xmlns:
                                                                'http://www.w3.org/2000/svg'
                                                        }
                                                    ]
                                                }
                                            }
                                        }
                                    }
                                }
                            ]
                        }
                    ]
                ]
            }
        }
    ]
});

module.exports.svgMinimizer = svgMinimizer;
