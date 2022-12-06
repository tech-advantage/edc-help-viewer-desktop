const homeDirectory = require('os').homedir()
const path = require('path')
const fs = require('fs')
const lunr = require('lunr')

const htmlFormatter = require('../HtmlFormatter')
const { Token } = require('lunr')

class ContentIndexer {
  static docBasePath = '../../../static/doc'
  static multiDocItems = {}
  static documents = []

  /**
     * Return multidoc content
     *
     * @returns {string}
     */
  static getMultiDocContent () {
    const multidoc = require(path.join(__dirname, ContentIndexer.docBasePath + '/multi-doc.json'))
    ContentIndexer.multiDocItems.productId = multidoc[0].productId
    ContentIndexer.multiDocItems.pluginId = multidoc[0].pluginId

    return ContentIndexer.multiDocItems
  }

  /**
     * Set toc reference
     */
  static tocIndexer () {
    const productFolder = path.join(__dirname, ContentIndexer.docBasePath + '/' + ContentIndexer.getMultiDocContent().pluginId)
    const tocJsonFile = require(productFolder + '/toc.json')
    const allTocsFiles = []
    for (const toc of tocJsonFile.toc) {
      allTocsFiles.push(toc)
    }
    for (const toc of allTocsFiles) {
      ContentIndexer.indexTocReference(productFolder, toc)
    }
  }

  /**
     * Get the nested content of topics nodes
     *
     * @param {*} arr
     * @param {*} existingChildren
     * @param {*} strategyId
     * @param {*} strategyLabel
     * @param {*} languageCode
     * @returns topics content
     */
  static getContentOfTopicsNodes (arr, existingChildren, strategyId, strategyLabel, languageCode) {
    arr.forEach(toc => {
      const topicObject = {
        id: toc.id,
        label: toc.label,
        url: toc.url,
        strategyId,
        strategyLabel,
        type: toc.type,
        languageCode,
        content_lower: htmlFormatter.removeTags(htmlFormatter.splitHtml(toc)).toLowerCase(),
        content: htmlFormatter.removeTags(htmlFormatter.splitHtml(toc))
      }

      ContentIndexer.documents.push(topicObject)
      existingChildren.push(toc.topics)
      toc.topics && ContentIndexer.getContentOfTopicsNodes(toc.topics, existingChildren, strategyId, strategyLabel, languageCode)
    })

    return existingChildren
  }

  /**
     * Set the content of topics nodes
     *
     * @param {*} productFolder
     * @param {*} tocReference
     */
  static indexTocReference (productFolder, tocReference) {
    const tocXjsonFile = productFolder + '\\' + tocReference.file

    if (tocXjsonFile) {
      let languageCode
      const tocJsonFile = require(tocXjsonFile)
      const strategyId = tocJsonFile.id
      let strategyLabel = null
      let fieldValue = null

      Object.keys(tocJsonFile).forEach(function (key) {
        if (key !== 'id') {
          languageCode = key
          fieldValue = tocJsonFile[key]
          strategyLabel = fieldValue.label
          ContentIndexer.getContentOfTopicsNodes(fieldValue.topics, [], strategyId, strategyLabel, languageCode)
        }
      })
    }
  }

  /**
     * Create and write the index with lunr
     */
  static createIndex () {
    const customTokenizerBackup = function (obj) {
      const arr = []
      const str = obj.toString()
      const strLength = str.length
      let originalToken
      const tokens = []
      let index
      let endIndex
      let isCompoundWord
      console.log(str, 'strstr')
      arr.push(str.split(' '))

      for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr[i].length; j++) {
          index = str.indexOf(arr[i][j])
          if (index !== -1) {
            endIndex = index + arr[i][j].length - 1
            console.log(index, endIndex)
          }

          tokens.push(
            new lunr.Token(arr[i][j], {
              position: [index, index + arr[i][j].length - 1],
              index: tokens.length,
              originalToken: arr[i][j]
            })
          )
        }
      }

      return tokens
    }

    const pagesIndex = ContentIndexer.documents
    const lunrIndex = lunr(function () {
      // this.tokenizer = customTokenizerBackup;

      this.pipeline.remove(lunr.stopWordFilter)
      this.pipeline.remove(lunr.stemmer)

      this.field('label')
      this.field('content')
      // this.field('content_lower')
      this.ref('id')
      this.metadataWhitelist = ['position']
      pagesIndex.forEach(function (doc) {
        this.add(doc)
      }, this)
    })

    const indexedContent = JSON.stringify(lunrIndex, null, 4)
    fs.writeFileSync(homeDirectory + '/edc_help_viewer/index/lunr.json', indexedContent)
  }
}
module.exports = ContentIndexer
