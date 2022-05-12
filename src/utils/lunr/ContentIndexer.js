const homedir = require('os').homedir();
const path = require('path');
const fs = require('fs');
const lunr = require('lunr');
const HtmlFormatter = require('../HtmlFormatter');

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

    static indexTocReference(productFolder, tocReference){
        let tocXjsonFile = productFolder + "\\" + tocReference.file;
        
        if(tocXjsonFile){
            let tocJsonFile = require(tocXjsonFile);
            let languageCode;

            let strategyId = tocJsonFile.id;
            let strategyLabel = null;
            let fieldValue = null;
           
            Object.keys(tocJsonFile).forEach(function(key) {
                if(key !== 'id'){
                    languageCode = key;
                    fieldValue = tocJsonFile[key];
                    strategyLabel = fieldValue.label;
                    
                    ContentIndexer.indexTopic(strategyId, languageCode, strategyLabel, fieldValue.topics);

                    for(let data of fieldValue.topics){
                        if(data.topics.length > 0){
                            for(let topic of data.topics){
                                let topicObject = {
                                    id: topic.id, 
                                    label: topic.label,
                                    url: topic.url,
                                    strategyId: strategyId,
                                    strategyLabel: strategyLabel,
                                    type: topic.type,
                                    languageCode: languageCode,
                                    url: topic.url,
                                    content: HtmlFormatter.removeTags(HtmlFormatter.splitHtml(topic))
                                }
                                ContentIndexer.documents.push(topicObject);
                            }
                        }  
                    }
                }
            });
        }
    }


    static indexTopic(strategyId, languageCode, strategyLabel, topicNode){
        let topicObj;

        for(let topic of topicNode){
            topicObj = {
                id: topic.id,
                strategyId: strategyId,
                languageCode: languageCode,
                type: topic.type,
                strategyLabel: strategyLabel,
                label: topic.label,
                content: HtmlFormatter.removeTags(HtmlFormatter.splitHtml(topic)),
                url: topic.url
            }
        }
        ContentIndexer.documents.push(topicObj);
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
         
        fs.writeFileSync(homedir + '/edc_help_viewer/index/lunr.json', indexedContent);
    }
      
}

module.exports = ContentIndexer;