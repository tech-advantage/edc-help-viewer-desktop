const ipc = require('electron').ipcRenderer;
const express = require('express');
const log = require('electron-log');
const {Validator} = require('express-json-validator-middleware');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const app = express();

const {getLogTransportConsole, getLogTransportFile, getLogResolvePath} = require('./lib/logFormat');
const ConfigElectronViewer = require('./utils/ConfigElectronViewer');
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

// Index the content for lunr
ContentIndexer.tocIndexer();
// Create index from the documentation
ContentIndexer.createIndex();

log.debug("Product ID = [" + ContentIndexer.getMultiDocContent().productId + "]; Plugin ID = [" + ContentIndexer.getMultiDocContent().pluginId + "];")

const urlSchema = {
    type: 'object',
    required: ['url'],
    properties: {
        url: {
            type: 'string',
        }
    },
};

// POST Request sended by the help viewer to redirect to the clicked link from the popover
app.post('/viewerurl', validate({body: urlSchema}),(req, res) => {
    let splitUrl = req.body.url.split('/');
    let languageCode = splitUrl[splitUrl.length -1];

    res.setHeader('Content-Type', 'application/json');

    if(res.status === 500){
        log.error(req, res);
        res.send('Internal Server Error');
    } else if(res.status === 404){
        const message = 'Unable to find the requested resource ! You can try another URL.';
        res.status(404).json({message});
    }

    ipc.send('requested-url', req.body.url);

    if(languageCode == "fr"){
        message = 'Chargement ...';
    }

    log.debug(`POST request body ${JSON.stringify({url: req.body.url})} was sending succesfully`);
    res.send(`POST request body ${JSON.stringify({url: req.body.url})} was sending succesfully`);
});

// GET Request to find the indexed content from lunr
app.get('/httpd/api/search', (req, res) => {
    let query = req.query['query'];
    let exactMatch = req.query['exact-match'];
    let lang = req.query['lang'];
    let limit = parseInt(req.query['limit']);
    let getSearchResults = SearchHandler.getSearchResults(query, exactMatch, lang ? lang : "en");
    res.setHeader('Content-Type', 'application/json');

    if(limit && limit > 0){
        getSearchResults = getSearchResults.slice(Math.max(getSearchResults.length - limit, 0));
    }

    if(res.status === 500){
        log.error(req, res);
        res.send('Internal Server Error');
    } else if(res.status === 404){
        const message = 'Unable to find the requested resource ! You can try another URL.';
        res.status(404).json({message});
    }
    
    log.debug("Query parameters: Query=["+ query +"], exactMatch=["+ exactMatch +"], lang=["+ lang +"], limit=["+ limit +"]");
    log.debug("Result length = " + getSearchResults.length);

    res.status(200).json(getSearchResults);
});

app.use(({res}) => {
    const message = 'Chargement ...';
    res.send(message);
});

var server = app.listen(ConfigElectronViewer.getServerPort(), () => {
    log.info(`Server listening on port : ${ConfigElectronViewer.getServerPort()}`);
});