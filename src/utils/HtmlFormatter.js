const fs = require('fs');
const path = require('path');

class HtmlFormatter {
    static docBasePath = '../../static/doc';

    /**
     * Return content between body tags
     * 
     * @param {*} topic 
     * @returns 
     */
    static splitHtml(topic){
        let dataFile = fs.readFileSync(path.join(__dirname, HtmlFormatter.docBasePath + "\\" + topic.url),
        {encoding:'utf8', flag:'r'});
        let splitAboveBody = dataFile.split('<body>').pop().replace(/(\r\n|\n|\r|\t|&nbsp;|&#39;|\s+)/gm, " ");
        let bodyContent = splitAboveBody.split('</body>').shift();

        return bodyContent;
    }

    /**
     * Remove all html tags
     * 
     * @param {*} str
     * @returns
     */
    static removeTags(str){
        if ((str===null) || (str===''))
            return false;
        else
            str = str.toString();
              
        return str.replace( /(<([^>]+)>)/ig, '');
    }

}

module.exports = HtmlFormatter;