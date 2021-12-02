const { NODE_ENV } = process.env;
const isProd = NODE_ENV === 'production';

module.exports = (api) => {
    api.cache.using(() => process.env.NODE_ENV);

    return {
        presets: [
            [
                '@babel/preset-env',
                {
                    modules: false,
                    useBuiltIns: 'entry',
                    corejs: 3
                }
            ],
            '@babel/react',
            '@babel/typescript'
        ],
        plugins: [
            'react-hot-loader/babel',
            [
                'babel-plugin-styled-components',
                {
                    ssr: false,
                    pure: true,
                    displayName: !isProd,
                    fileName: !isProd
                }
            ]
        ]
    };
};
