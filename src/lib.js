const path = require('path');
const kill = require('tree-kill');
const importCwd = require('import-cwd');

const { paths = {} } = importCwd('./webpack-eject.js');

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

const rootDir = path.resolve(process.cwd());

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
