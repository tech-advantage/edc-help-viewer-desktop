
const path = require('path');
const fs = require('fs');
var fsExtra = require('fs-extra');
const request = require('superagent');
const admZip = require('adm-zip');

const ROOT_FOLDER = path.resolve(__dirname);
const REPO_NAME = 'edc-help-viewer';
const ZIP_FILE = 'edc-help-viewer.3.2.2.zip';
const EDC_VIEWER_FOLDER = 'edc-help-viewer.3.2.2';
const GIT_EDC_VIEWER_URL = `https://github.com/tech-advantage/${REPO_NAME}/releases/download/v3.2.2`;
const source = `${GIT_EDC_VIEWER_URL}/${ZIP_FILE}`;

const srcDir = `${ROOT_FOLDER}\\${EDC_VIEWER_FOLDER}\\help`;
const destDir = `${ROOT_FOLDER}\\help`;

module.exports.initViewer = function () {
    request
    .get(source)
    .on('error', function(error) {
        console.log(error);
    })
    .pipe(fs.createWriteStream(ZIP_FILE))
    .on('finish', async function() {
        console.log('finished dowloading');
        let zip = new admZip(ZIP_FILE);
        console.log('start unzip');
        zipEntries = zip.getEntries();
        zip.extractAllTo(ROOT_FOLDER, true);
        console.log('finished unzip');
        
        await fsExtra.move(srcDir, destDir, console.error);
        
        fs.unlinkSync(ROOT_FOLDER + "\\" + ZIP_FILE);
        //fs.rmdirSync(ROOT_FOLDER + "\\" + 'edc-help-viewer.3.2.2');
        //fs.rmSync(ROOT_FOLDER + "\\" + 'edc-help-viewer.3.2.2', { recursive: true, force: true }, console.error)
    });
};