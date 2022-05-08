#! /usr/bin/env node
const path = require('path');
const { rootDir } = require('./lib');

require('dotenv').config({ path: path.join(rootDir, '.env') });
const spawn = require('cross-spawn');

const [task] = process.argv.slice(2);
const devConfig = require.resolve(`./webpack.dev.js`);
const prodConfig = require.resolve(`./webpack.prod.js`);
const libraryConfig = require.resolve(`./webpack.library.js`);

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
    case 'library': {
        result = spawn.sync('webpack', ['--config', libraryConfig], {
            stdio: 'inherit'
        });
        break;
    }
    case 'build:preview': {
        result = spawn.sync(
            `webpack --config ${prodConfig} --progress && ${previewDistFolder}`,
            {
                stdio: 'inherit'
            }
        );
        break;
    }
    case 'preview': {
        result = spawn.sync(previewDistFolder, {
            stdio: 'inherit'
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
