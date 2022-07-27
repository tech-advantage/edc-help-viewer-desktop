const homedir = require('os').homedir();
const path = require('path');
const fs = require('fs');
const lunr = require('lunr');
const ContentIndexer = require('./ContentIndexer');

class SearchHandler {
    static homePath = path.join(homedir, '/edc_help_viewer/index/lunr.json');

    /**
     * Returns found documents by the research
     * 
     * @param {*} query
     * @param {*} exactMatch
     * @param {*} languageCode
     * @returns {Array}
     */
    static getSearchResults(query, exactMatch, languageCode){
        let result;
        let idxLunr = fs.readFileSync(SearchHandler.homePath, {encoding:'utf8', flag:'r'});
        var data = JSON.parse(idxLunr);
        var idx = lunr.Index.load(data);

        query = exactMatch == "false" ? query = query += "*" : query;
        
        return idx.search(query).flatMap((hit) => {
            if (hit.ref == "undefined") return [];
            let pageMatch = ContentIndexer.documents.filter((page) => page.id === hit.ref);
            pageMatch.score = hit.score;

            if(languageCode && languageCode !== undefined){
                result = pageMatch.filter((page) => page.languageCode === languageCode);
            }else{
                result = pageMatch.filter((page) => page.languageCode === "en");
            }
            
            return result;
        });
    }
}
module.exports = SearchHandler;