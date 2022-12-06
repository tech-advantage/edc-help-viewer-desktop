const homedir = require('os').homedir()
const path = require('path')
const log = require('electron-log')
const fs = require('fs')
const lunr = require('lunr')
const ContentIndexer = require('./ContentIndexer')
const { getLogTransportConsole, getLogTransportFile, getLogResolvePath } = require('../../lib/logFormat')

class SearchHandler {
  static homePath = path.join(homedir, '/edc_help_viewer/index/lunr.json')

  /**
     * Returns found documents by the research
     *
     * @param {*} query
     * @param {*} exactMatch
     * @param {*} languageCode
     * @returns {Array}
     */
  static getSearchResults (query, languageCode, matchWholeWord, matchCase, maxResultNumber) {
    let result
    const idxLunr = fs.readFileSync(SearchHandler.homePath, { encoding: 'utf8', flag: 'r' })
    const data = JSON.parse(idxLunr)
    // if(matchCase){
    //   var index = data.fields.indexOf("content_lower");
    //   console.log(index,"indexxx");
    //   if (index !== -1) {
    //     data.fields.splice(index, 1);
    //   }
    // } else {
    //   var index = data.fields.indexOf("content");
    //   console.log(index,"indexxx");
    //   if (index !== -1) {
    //     data.fields.splice(index, 1);
    //   }
    // }

    const idx = lunr.Index.load(data)
    if (!matchWholeWord) {
      query = query += '*'
    }

    if (matchWholeWord && matchCase || matchWholeWord) {
      if (query.length >= 9) {
        query = query += '*'
      }
    }

    log.debug('Query parameters: Query=[' + query + '], lang=[' + languageCode + '], matchWholeWord=[' + matchWholeWord + '], matchCase=[' + matchCase + '], maxResultNumber=[' + maxResultNumber + ']')

    return idx.search(query).flatMap((hit) => {
      if (hit.ref === 'undefined') return []

      const pageMatch = ContentIndexer.documents.filter((page) => page.id === hit.ref)
      pageMatch.score = hit.score

      if (languageCode && languageCode !== undefined) {
        result = pageMatch.filter((page) => page.languageCode == languageCode)
      } else {
        result = pageMatch.filter((page) => page.languageCode == 'en')
      }

      let reg
      let flag = 'g'
      let search = '(' + query + ')'

      if (matchCase && matchWholeWord == false) {
        search = search.replace('*', '')
        reg = new RegExp(search, 'g')
      }

      if (matchWholeWord && matchCase == false) {
        flag = 'gi'
        reg = new RegExp('(\\b)' + search + '(\\b)', 'gi')
      }

      if (matchWholeWord && matchCase) {
        flag = 'g'
        reg = new RegExp('(\\b)' + search + '(\\b)', 'g')
      }

      if (result[0].content.match(reg)) {
        return result
      }

      return []
    })
  }
}
module.exports = SearchHandler
