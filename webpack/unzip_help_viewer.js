const fs = require('fs');
const admZip = require('adm-zip');
const { ROOT_FOLDER } = require('../conf/edc_const')


module.exports.initViewer = function () {
    let zip_file = fs.readdirSync(ROOT_FOLDER + '/dist/zip');
    let zip = new admZip(ROOT_FOLDER + '/dist/zip/' + zip_file);
    console.log('start unzip');
    zipEntries = zip.getEntries();
    zip.extractAllTo(ROOT_FOLDER, true);
    console.log('end script');
};
