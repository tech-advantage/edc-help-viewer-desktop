const fs = require('fs');
const admZip = require('adm-zip');
let util = require('util');

const { ROOT_FOLDER } = require('../conf/edc_const');

module.exports.initViewer = function () {

    let logDate = new Date();
    let logDateLocal = logDate.toLocaleString()

    var log_file = fs.createWriteStream(__dirname + '/log/debug.log', {flags : 'w'});

    // Write logs in file
    console.log = function(d) {
        log_file.write(logDateLocal + ' ' + util.format(d) + '\n');
    };
    
    // Read the content of a given directory
    let zip_file = fs.readdirSync(ROOT_FOLDER + '/dist/zip');

    // Read the archive
    let zip = new admZip(ROOT_FOLDER + '/dist/zip/' + zip_file);
    console.log('start unzip');

    try {
        // Return an array with files and directory from archive
        zipEntries = zip.getEntries();

        // Extracts the entire archive to the given location.
        zip.extractAllTo(ROOT_FOLDER, true);
        console.log('done unzip');
    } catch (e) {
        console.log(e);
    }
};
