
const path = require('path')
const fs = require('fs')
const fse = require('fs-extra');
const request = require('superagent')
const admZip = require('adm-zip');
const glob = require('glob')

const ROOT_FOLDER = path.resolve(__dirname)
const REPO_NAME = 'edc-help-viewer'
const ZIP_FILE = 'edc-help-viewer.3.2.2.zip'
const GIT_EDC_VIEWER_URL = `https://github.com/tech-advantage/${REPO_NAME}/releases/download/v3.2.2`;
const source = `${GIT_EDC_VIEWER_URL}/${ZIP_FILE}`;

const srcDir = `${ROOT_FOLDER}\\edc-help-viewer.3.2.2`;
const destDir = `${ROOT_FOLDER}\\toto`;
console.log('srcDir', srcDir)
module.exports.initViewer = function () {
    request
    .get(source)
    .on('error', function(error) {
        console.log(error);
    })
    .pipe(fs.createWriteStream(ZIP_FILE))
    .on('finish', function() {
        console.log('finished dowloading');
        let zip = new admZip(ZIP_FILE);
        console.log('start unzip');
        zipEntries = zip.getEntries();
        zip.extractAllTo(ROOT_FOLDER, true);
        console.log('finished unzip');
        
    });
};