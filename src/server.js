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
const ContentIndexer = require('./utils/lunr/ContentIndexer');
const SearchHandler = require('./utils/lunr/SearchHandler');
const { validate } = new Validator();
let message = 'Loading ...';

// Method to format the writings logs
getLogTransportConsole();
getLogTransportFile();
getLogResolvePath();

log.info('Server started');

app
.use(cors())
.use(bodyParser.json())
.use(express.static(path.join(__dirname, '../static')));

ContentIndexer.tocIndexer();


log.debug("Product ID = [" + ContentIndexer.getMultiDocContent().productId + "]; Plugin ID = [" + ContentIndexer.getMultiDocContent().pluginId + "];")

ContentIndexer.createIndex();

const urlSchema = {
    type: 'object',
    required: ['url'],
    properties: {
        url: {
            type: 'string',
        }
    },
};

app.post('/viewerurl', validate({body: urlSchema}),(req, res) => {
    res.setHeader('Content-Type', 'application/json');

    if(res.status === 500){
        log.error(req, res);
        res.send('Internal Server Error');
    } else if(res.status === 404){
        const message = 'Unable to find the requested resource ! You can try another URL.';
        res.status(404).json({message});
    }

    ipc.send('requested-url', req.body.url);

    let splitUrl = req.body.url.split('/');
    let languageCode = splitUrl[splitUrl.length -1];

    if(languageCode == "fr"){
        message = 'Chargement ...';
    }

    log.debug(`POST request body ${JSON.stringify({url: req.body.url})} was sending succesfully`);
    res.send(`POST request body ${JSON.stringify({url: req.body.url})} was sending succesfully`);
});

app.get('/httpd/api/search', (req, res) => {
    let query = req.query['query'];
    let exactMatch = req.query['exact-match'];
    let lang = req.query['lang'];
    let limit = parseInt(req.query['limit']);

    res.setHeader('Content-Type', 'application/json');
    if(res.status === 500){
        log.error(req, res);
        res.send('Internal Server Error');
    } else if(res.status === 404){
        const message = 'Unable to find the requested resource ! You can try another URL.';
        res.status(404).json({message});
    }
    
    let getSearchResults = SearchHandler.getSearchResults(query, exactMatch, lang ? lang : "en");
    
    if(limit && limit > 0){
        getSearchResults = getSearchResults.slice(Math.max(getSearchResults.length - limit, 0));
    }

    log.debug("Query parameters: Query=["+ query +"], exactMatch=["+ exactMatch +"], lang=["+ lang +"], limit=["+ limit +"]");
    log.debug("Result length = " + getSearchResults.length);

    res.status(200).json(getSearchResults);
});

app.use(({res}) => {
    const message = 'Chargement ...';
    res.send(message);
});

var server = app.listen(ConstructURL.getServerPort(), () => {
    log.info(`Server listening on port : ${ConstructURL.getServerPort()}`);
});