const { initWebpackCommon } = require('../src/index');
const { rootDir, paths } = require('./lib');

const aliases = {
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
    '@processes': 'processes',
    '@feature-toggle-components': 'feature-toggle-components'
};

module.exports.webpackCommon = initWebpackCommon({
    rootDir,
    aliases,
    paths,
    libPath: 'public/lib'
});
