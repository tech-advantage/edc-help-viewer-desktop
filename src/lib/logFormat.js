const log = require('electron-log');
const path = require('path');

module.exports = {
    // Format logs to the terminal
    getLogTransportConsole: () => {
        return log.transports.console.format = '[{d}-{m}-{y} {h}:{i}:{s} .{ms}] > [{level}] {text}';
    },
    // Format logs to the file
    getLogTransportFile: () => {
        return log.transports.file.format = '[{d}-{m}-{y} {h}:{i}:{s} .{ms}] > [{level}] {text}';
    },
    // Write the log to the specified file
    getLogResolvePath: () => {
        return log.transports.file.resolvePath = () => path.join(getUserHome(), '/edc_help_viewer/log/main.log');
    }
}

function getUserHome() {
    return process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
}
