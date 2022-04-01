const configViewer = require('../../conf/config_electron_viewer.json');
const rootPath = require('electron-root-path').rootPath;
const path = require('path');

class ConstructURL {

    /**
     * Check the string passed
     * 
     * @param {*} str 
     * @returns
     */
    static isEmpty(str) {
        return (!str || str.length === 0 );
    }

    /**
     * Return the protocol url
     * 
     * @returns {string}
     */
    static getProtocol() {
        if(this.isEmpty(configViewer.protocol)){
            return 'http';
        }
        return configViewer.protocol;
    }

    /**
     * Return the host name
     * 
     * @returns {string}
     */
    static getHostName() {
        if (this.isEmpty(configViewer.hostname)){
            return 'localhost';
        }
        return configViewer.hostname;
    }

    /**
     * Return the server port number
     * 
     * @returns {number}
     */
    static getServerPort() {
        if(!configViewer.server_port){
            return 60000;
        }else if(typeof configViewer.server_port === 'string'){
            return parseInt(configViewer.server_port);
        }
        return configViewer.server_port;
    }

    /**
     * Return the url constructed
     * 
     * @returns {string} the url constructed
     */
    static getUrl() {
        return this.getProtocol() + '://' + this.getHostName() + ':' + this.getServerPort();
    }

    /**
     * Return the home page of viewer
     * 
     * @returns {string} the home viewer url
     */
    static getHelpViewerHomePath(){
        return this.getUrl() + '/help/index.html';
    }

    /**
     * Return the preload html file
     * 
     * @returns {string} the static index.html
     */
    static getStaticFileLoaderPath(){
        return `file://${path.join(__dirname, '../../', 'public/index.html')}`;
    }

    /**
     * Return the viewer config path
     * 
     * @returns {string} the static viewer config path
     */
    static getStaticViewerConfigPath(){
        return path.join(__dirname, '../../', 'static/help/assets/config.json');
    }
}

module.exports = ConstructURL