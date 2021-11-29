const fs = require('fs');
var fsExtra = require('fs-extra');
const request = require('superagent');
const admZip = require('adm-zip');

const ROOT_FOLDER = process.cwd();
const REPO_NAME = 'edc-help-viewer';
const ZIP_FILE = 'edc-help-viewer.3.2.2.zip';
const EDC_VIEWER_FOLDER = 'edc-help-viewer.3.2.2';
const GIT_EDC_VIEWER_URL = `https://github.com/tech-advantage/${REPO_NAME}/releases/download/v3.2.2`;
const source = `${GIT_EDC_VIEWER_URL}/${ZIP_FILE}`;
const srcDir = `${ROOT_FOLDER}\\${EDC_VIEWER_FOLDER}\\help`;
const destDir = `C:\\help`;


const patterns = [
    { from: process.cwd() + '/edc-help-viewer.3.2.2/help', to: 'help' },
];

module.exports.initViewer = function () {
    // request
    // .get(source)
    // .on('error', function(error) {
    //     console.log(error);
    // })
    // .pipe(fs.createWriteStream(ZIP_FILE))
    // .on('finish', async function() {
    //     console.log('finished dowloading');
        
        console.log('je suis dans le script');
        
        // fsExtra.move(srcDir, destDir, (err) =>{
        //     if(!err){
        //         console.log('The folder ' + EDC_VIEWER_FOLDER + ' was removed.')
        //         fs.rmSync(ROOT_FOLDER + "\\" + EDC_VIEWER_FOLDER, { recursive: true, force: true }, console.error);
        //     }else {
        //         console.error
        //     }
        // })
        
        // fs.unlinkSync(ROOT_FOLDER + "\\" + ZIP_FILE);
    //})

        let zip_file = fs.readdirSync('./webpack/dist/zip')
    
        let zip = new admZip('./webpack/dist/zip/' + zip_file);
        console.log('start unzip');
        zipEntries = zip.getEntries();
        zip.extractAllTo(ROOT_FOLDER, true);
        
        console.log('end script');
    
};
