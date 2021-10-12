const { exec } = require('child_process');

module.exports.genDll = () => {
    console.log('\x1b[33m', 'Generating dll for dependencies...');
    exec('webpack --config configs/webpack/webpack.library.js', (error) => {
        console.log('\x1b[32m', 'Dll installation completed');
        if (error !== null) {
            console.log(`exec error: ${error}`);
        }
    });
};
