const { initWebpackLibrary } = require('../src/index');
const { dependencies } = require('../package.json');
const { rootDir } = require('./lib');

const { ['react-imask']: value, ...allDependencies } = dependencies;

module.exports = initWebpackLibrary(rootDir, allDependencies);
