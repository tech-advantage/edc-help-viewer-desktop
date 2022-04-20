const ipc = require('electron').ipcRenderer;
const express = require('express');
const log = require('electron-log');
const {Validator} = require('express-json-validator-middleware');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const app = express();

const {getLogTransportConsole, getLogTransportFile, getLogResolvePath} = require('./lib/logFormat');
const ConstructURL = require('./utils/ConstructURL');
const { validate } = new Validator();


window.addEventListener('DOMContentLoaded', () => {
    // Method to format the writings logs
    getLogTransportConsole();
    getLogTransportFile();
    getLogResolvePath();

    log.info('Server started');

    app
    .use(cors())
    .use(bodyParser.json())
    .use(express.static(path.join(__dirname, '../static')))
    .use(express.static(path.join(__dirname, '../static/help/assets/style')))
    .use(express.static(path.join(__dirname, '../static/help/assets')));

    const urlSchema = {
        type: 'object',
        required: ['url'],
        properties: {
            url: {
                type: 'string',
            }
        },
    }

    app.post('/viewerurl', validate({body: urlSchema}),(req, res) => {
        res.setHeader('Content-Type', 'application/json');

        if(res.status === 500){
            log.error(req, res);
            res.send('Internal Server Error');
        }

        ipc.send('requested-url', req.body.url);

        log.debug(`POST request body ${JSON.stringify({url: req.body.url})} was sending succesfully`);
        res.send(`POST request body ${JSON.stringify({url: req.body.url})} was sending succesfully`);
    })

    app.use(({res}) => {
        const message = 'Unable to find the requested resource ! You can try another URL.';
        res.status(404).json({message});
    })

    var server = app.listen(ConstructURL.getServerPort(), () => {
        log.info(`Server listening on port : ${ConstructURL.getServerPort()}`);
    });
})
