const path = require('path');
const kill = require('tree-kill');

const folderAliasesCommon = {
    '@features': 'features',
    /* components и router оставил для обратной совместимости со старыми проектам
    будут удалены в следующих версиях */
    '@components': 'components',
    '@router': 'router',
    '@assets': 'assets',
    '@api': 'api',
    '@store': 'store',
    '@ui': 'ui',
    '@pages': 'pages',
    '@processes': 'processes'
};

module.exports.setupAliases = (
    sourcePath,
    folderAliases = folderAliasesCommon
) => {
    const newFolderAliases = {};

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

module.exports.getCommonPaths = (rootDir) => {
    const sourcePath = path.join(rootDir, 'src');
    const staticPath = path.join(sourcePath, 'public');
    const assetsPath = path.join(sourcePath, 'assets');
    const outputPath = path.join(rootDir, 'dist');
    const publicPath = '/public/';

    return {
        sourcePath,
        staticPath,
        assetsPath,
        outputPath,
        publicPath
    };
};
