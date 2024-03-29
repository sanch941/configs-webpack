const isDev = process.env.NODE_ENV !== 'production';
const path = require('path');
const kill = require('tree-kill');
const importCwd = require('import-cwd');

const {
    paths = {},
    babelSourceType = 'unambiguous',
    rootDir: rootDirFromEject
} = importCwd('./webpack-eject.js');

const debugBabel = process.env.BABEL_DEBUG === 'true';

const folderAliasesCommon = {
    '@features': 'features',
    '@router': 'router',
    '@assets': 'assets',
    '@processes': 'processes',
    '@api': 'api',
    '@store': 'store',
    '@ui': 'ui',
    '@pages': 'pages',
    '@feature-toggle-components': 'feature-toggle-components',
    '@lib': 'lib'
};

const rootDir = rootDirFromEject || path.resolve(process.cwd());

module.exports.rootDir = rootDir;

module.exports.setupAliases = (sourcePath, folderAliases) => {
    const newFolderAliases = {};
    folderAliases = { ...folderAliasesCommon, ...folderAliases };

    Object.keys(folderAliases).map((key) => {
        const folder = folderAliases[key];
        newFolderAliases[key] = path.join(sourcePath, folder);
    });

    return newFolderAliases;
};

const pid = process.pid;

module.exports.killOnCtrlC = () => {
    process.on('SIGINT', function () {
        kill(pid, 'SIGKILL');
    });
};

module.exports.getCommonPaths = () => {
    const sourcePath = path.join(rootDir, 'src');
    const staticPath = path.join(sourcePath, 'public');
    const assetsPath = path.join(sourcePath, 'assets');
    const outputPath = path.join(rootDir, 'dist');
    const publicPath = '/';

    const commonPaths = {
        sourcePath,
        staticPath,
        assetsPath,
        outputPath,
        publicPath
    };

    return {
        ...commonPaths,
        ...paths
    };
};

module.exports.setupBabel = (mode) => {
    const commonPresets = [
        [
            '@babel/preset-env',
            {
                modules: false,
                useBuiltIns: 'usage',
                corejs: 3,
                debug: debugBabel
            }
        ],
        '@babel/react',
        '@babel/typescript'
    ];

    const commonPlugins = [
        [
            'babel-plugin-styled-components',
            {
                ssr: false,
                pure: true,
                displayName: isDev,
                fileName: isDev
            }
        ]
    ];

    switch (mode) {
        case 'dev':
            return {
                presets: commonPresets,
                plugins: [...commonPlugins, 'react-refresh/babel']
            };
        case 'prod':
            return {
                presets: commonPresets,
                plugins: [...commonPlugins, '@babel/plugin-transform-runtime'],
                ignore: [
                    /(?:@?babel(?:\/|\{1,2}|-).+)|regenerator-runtime|core-js/
                ],
                sourceType: babelSourceType
            };
        default:
            throw new Error('Unsupported mode');
    }
};
