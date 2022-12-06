const ipc = require('electron').ipcRenderer
const express = require('express')
const log = require('electron-log')
const { Validator } = require('express-json-validator-middleware')
const bodyParser = require('body-parser')
const cors = require('cors')
const path = require('path')
const app = express()

const { getLogTransportConsole, getLogTransportFile, getLogResolvePath } = require('./lib/logFormat')
const ConfigElectronViewer = require('./utils/ConfigElectronViewer')
const ContentIndexer = require('./utils/lunr/ContentIndexer')
const SearchHandler = require('./utils/lunr/SearchHandler')
const { validate } = new Validator()
let loaderMessage = 'Loading ...'
let message = ''
// Method to format the writings logs
getLogTransportConsole()
getLogTransportFile()
getLogResolvePath()

log.info('Server started')

app
  .use(cors())
  .use(bodyParser.json())
  .use(express.static(path.join(__dirname, '../static')))

// Index the content for lunr
ContentIndexer.tocIndexer()
// Create index from the documentation
ContentIndexer.createIndex()

log.debug('Product ID = [' + ContentIndexer.getMultiDocContent().productId + ']; Plugin ID = [' + ContentIndexer.getMultiDocContent().pluginId + '];')

const urlSchema = {
  type: 'object',
  required: ['url'],
  properties: {
    url: {
      type: 'string'
    }
  }
}

function hasQueryParams (url) {
  return url.indexOf('?') !== -1
}

// POST Request sended by the help viewer to redirect to the clicked link from the popover
app.post('/viewerurl', validate({ body: urlSchema }), (req, res) => {
  const splitUrl = req.body.url.split('/')
  const languageCode = splitUrl[splitUrl.length - 1]

  res.setHeader('Content-Type', 'application/json')

  if (res.status === 500) {
    log.error(req, res)
    res.send('Internal Server Error')
  } else if (res.status === 404) {
    const message = 'Unable to find the requested resource ! You can try another URL.'
    res.status(404).json({ message })
  }

  ipc.send('requested-url', req.body.url)

  if (languageCode === 'fr') {
    loaderMessage = 'Chargement ...'
  }

  log.debug(`POST request body ${JSON.stringify({ url: req.body.url })} was sending succesfully`)
  res.send(`POST request body ${JSON.stringify({ url: req.body.url })} was sending succesfully`)
})

// GET Request to find the indexed content from lunr
app.get('/httpd/api/search', (req, res) => {
  if (hasQueryParams(req.url) == false) {
    message = 'Query parameters are missing'
    res.status(400).json({ message })
  }
  const query = req.query.query
  let matchWholeWord = req.query['match-whole-word']
  let matchCase = req.query['match-case']

  matchWholeWord = matchWholeWord == undefined ? false : matchWholeWord != 'false'
  matchCase = matchCase == undefined ? false : matchCase != 'false'

  const lang = req.query.lang.length == '' ? 'en' : req.query.lang
  const maxResultNumber = parseInt(req.query['max-result-number'])
  let getSearchResults = SearchHandler.getSearchResults(query, lang, matchWholeWord, matchCase, maxResultNumber)
  res.setHeader('Content-Type', 'application/json')

  if (maxResultNumber && maxResultNumber > 0) {
    getSearchResults = getSearchResults.slice(Math.max(getSearchResults.length - maxResultNumber, 0))
  }

  if (res.status === 500) {
    log.error(req, res)
    res.send('Internal Server Error')
  } else if (res.status === 404) {
    message = 'Unable to find the requested resource ! You can try another URL.'
    res.status(404).json({ message })
  }

  res.status(200).json(getSearchResults)
})

app.use(({ res }) => {
  loaderMessage = 'Chargement ...'
  res.send(loaderMessage)
})

const server = app.listen(ConfigElectronViewer.getServerPort(), () => {
  log.info(`Server listening on port : ${ConfigElectronViewer.getServerPort()}`)
})
