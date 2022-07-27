const homeDirectory = require('os').homedir();
const path = require('path');
const fs = require('fs');
const lunr = require('lunr');
const htmlFormatter = require('../HtmlFormatter');


class ContentIndexer{
    static docBasePath = '../../../static/doc';
    static multiDocItems = {};
    static documents = [];

    /**
     * Return multidoc content
     * 
     * @returns {string}
     */
    static getMultiDocContent(){
        let multidoc = require(path.join(__dirname, ContentIndexer.docBasePath + "/multi-doc.json"));
        ContentIndexer.multiDocItems.productId = multidoc[0].productId;
        ContentIndexer.multiDocItems.pluginId = multidoc[0].pluginId;

        return ContentIndexer.multiDocItems;
    }

    /**
     * Set toc reference
     */
    static tocIndexer(){
        let productFolder = path.join(__dirname, ContentIndexer.docBasePath + "/" + ContentIndexer.getMultiDocContent().pluginId);
        let tocJsonFile = require(productFolder + "/toc.json");
        let allTocsFiles = [];
        for(let toc of tocJsonFile.toc){
            allTocsFiles.push(toc);
        }
        for(let toc of allTocsFiles){
            ContentIndexer.indexTocReference(productFolder, toc);
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
    static getContentOfTopicsNodes(arr, existingChildren, strategyId, strategyLabel, languageCode) {
        arr.forEach(toc => {
            let topicObject = {
                id: toc.id,
                label: toc.label,
                url: toc.url,
                strategyId: strategyId,
                strategyLabel: strategyLabel,
                type: toc.type,
                languageCode: languageCode,
                url: toc.url,
                content: htmlFormatter.removeTags(htmlFormatter.splitHtml(toc))
            }
            
            ContentIndexer.documents.push(topicObject);
            existingChildren.push(toc.topics);
            toc.topics && ContentIndexer.getContentOfTopicsNodes(toc.topics, existingChildren, strategyId, strategyLabel, languageCode);
        });
        
        return existingChildren;
    }

    /**
     * Set the content of topics nodes
     * 
     * @param {*} productFolder
     * @param {*} tocReference 
     */
    static indexTocReference(productFolder, tocReference){
        let tocXjsonFile = productFolder + "\\" + tocReference.file;
        
        if(tocXjsonFile){
            let languageCode;
            let tocJsonFile = require(tocXjsonFile);
            let strategyId = tocJsonFile.id;
            let strategyLabel = null;
            let fieldValue = null;
           
            Object.keys(tocJsonFile).forEach(function(key) {
                if(key !== 'id'){
                    languageCode = key;
                    fieldValue = tocJsonFile[key];
                    strategyLabel = fieldValue.label;
                    ContentIndexer.getContentOfTopicsNodes(fieldValue.topics, [], strategyId, strategyLabel, languageCode)
                }
            });
        }
    }

    /**
     * Create and write the index with lunr
     */
    static createIndex(){
        let pagesIndex;
        pagesIndex = ContentIndexer.documents;
        let lunrIndex = lunr(function () {
            this.pipeline.remove(lunr.stopWordFilter);
            this.pipeline.remove(lunr.stemmer);
            this.field("label");
            this.field("content");
            this.ref("id");
            pagesIndex.forEach(function (doc){
                this.add(doc);
            }, this)
        });
          
        const indexedContent = JSON.stringify(lunrIndex, null, 4);
        fs.writeFileSync(homeDirectory + '/edc_help_viewer/index/lunr.json', indexedContent);
    }
      
}
module.exports = ContentIndexer;