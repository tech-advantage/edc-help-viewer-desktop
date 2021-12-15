const fs = require('fs');
const admZip = require('adm-zip');
const log = require('electron-log');
const { ROOT_FOLDER } = require('../conf/edc_const');
const path = require('path');
const {getLogTransportConsole, getLogTransportFile, getLogResolvePath} = require('../src/lib/logFormat')

module.exports.unzipViewer = function () {

    getLogTransportConsole()
    getLogTransportFile()
    getLogResolvePath()

    // Read the content of a given directory
    let zip_file = fs.readdirSync(ROOT_FOLDER + '/dist/zip');

    // Read the archive
    let zip = new admZip(ROOT_FOLDER + '/dist/zip/' + zip_file);

    log.info('%c start unzip', 'color: green');
    
    try {
        // Return an array with files and directory from archive
        zipEntries = zip.getEntries();

        // Extracts the entire archive to the given location.
        zip.extractAllTo(ROOT_FOLDER, true);
        log.info('%c done unzip', 'color: green');
        
    } catch (e) {
        log.error(e);
        
    }
};
