const path = require('path')
const fs = require('fs')
const lunr = require('lunr')
const htmlFormatter = require('../HtmlFormatter')
const Logger = require('../../lib/Logger')
const PathResolver = require('../PathResolver')

class ContentIndexer {
  static docBasePath = '../../../static/doc'
  static multiDocItems = []
  static documents = []

  /**
     * Return multidoc content
     *
     * @returns {string}
     */
  static getMultiDocContent () {
    const multidoc = require(path.join(__dirname, ContentIndexer.docBasePath + '/multi-doc.json'))
    
    for(const doc of multidoc){
      let docElement = {}
      docElement.productId = doc.productId
      docElement.pluginId = doc.pluginId
      ContentIndexer.multiDocItems.push(docElement)
    }
    return ContentIndexer.multiDocItems
  }

  /**
     * Set toc reference
     */
  static tocIndexer () {
    let productsDirPath = []
    let productsData = []

    for(const multidoc of ContentIndexer.getMultiDocContent()){
      productsDirPath.push(path.join(__dirname, ContentIndexer.docBasePath + '/' + multidoc.pluginId))
    }
    for(const productDirPath of productsDirPath){
      let productItemObject = {}
      productItemObject.productDirPath = productDirPath
      try{
        productItemObject.item = require(productDirPath + '/toc.json')
      }
      catch (e) {
        Logger.log().error("Toc files for the given product not found", e)
      }
      productsData.push(productItemObject)
    }
    for(const product of productsData){
      for(const toc of product.item.toc){
        ContentIndexer.indexTocReference(product.productDirPath, toc)
      }
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
        languageCode: languageCode,
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
     * @param {*} productDir
     * @param {*} tocReference
     */
  static indexTocReference (productDir, tocReference) {
    const tocXjsonFile = productDir + '\\' + tocReference.file

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
    
    const pagesIndex = ContentIndexer.documents
    const lunrIndex = lunr(function () {
        
    this.pipeline.remove(lunr.stopWordFilter)
    this.pipeline.remove(lunr.stemmer)
      
    this.field('label')
    this.field('content')
    this.ref('id')
    this.metadataWhitelist = ['position']
    pagesIndex.forEach(function (doc) {
      this.add(doc)
      }, this)
    })

    const indexedContent = JSON.stringify(lunrIndex, null, 4)
    fs.writeFileSync(PathResolver.getUserHome() + '/edc_help_viewer/index/lunr.json', indexedContent)
  }
}
module.exports = ContentIndexer
