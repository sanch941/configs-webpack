#! /usr/bin/env node
const path = require('path');
const { rootDir } = require('./lib');

require('dotenv').config({ path: path.join(rootDir, '.env') });
const spawn = require('cross-spawn');

const [task] = process.argv.slice(2);
const devConfig = require.resolve(`./webpack.dev.js`);
const prodConfig = require.resolve(`./webpack.prod.js`);

const previewDistFolder = 'http-server ./dist -o -g -p 8097';

let result;
switch (task) {
    case 'dev': {
        result = spawn.sync(
            'webpack-dev-server',
            ['--config', devConfig, '--progress'],
            { stdio: 'inherit' }
        );
        break;
    }
    case 'build': {
        result = spawn.sync('webpack', ['--config', prodConfig, '--progress'], {
            stdio: 'inherit'
        });
        break;
    }
    case 'build:preview': {
        result = spawn.sync(
            `webpack --config ${prodConfig} --progress && ${previewDistFolder}`,
            {
                shell: true
            }
        );
        break;
    }
    case 'preview': {
        result = spawn.sync(previewDistFolder, {
            shell: true
        });
        break;
    }
    case 'clean-cache': {
        result = spawn.sync(`rimraf ${rootDir}/node_modules/.cache/`, {
            shell: true
        });
        break;
    }
    default:
        console.log(`Unknown script "${task}".`);
}

if (result.signal) {
    process.exit(1);
}

process.exit(result.status);
