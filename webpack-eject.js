const path = require('path');
const rootDir = path.resolve(process.cwd());
require('dotenv').config({ path: path.join(rootDir, '.env') });

const folderName = process.env.PROJECT_FOLDER_NAME;

module.exports = {
    rootDir: path.join(rootDir, 'example', folderName),
    optimizeImage: true
};
