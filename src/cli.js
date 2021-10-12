const { genDll } = require('./gen-dll');

module.exports.cli = (options) => {
    if (options.gendll) {
        genDll();
    }
};
