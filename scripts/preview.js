const path = require('path');
const rootDir = path.resolve(process.cwd());
const spawn = require('cross-spawn');
require('dotenv').config({ path: path.join(rootDir, '.env') });

const folderName = process.env.PROJECT_FOLDER_NAME;
const previewDistFolder = `http-server ./example/${folderName}/dist -o -g -p 8097`;

const result = spawn.sync(previewDistFolder, {
    shell: true
});

if (result.signal) {
    process.exit(1);
}

process.exit(result.status);
