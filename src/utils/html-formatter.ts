import { Topic } from './../global/types';
import { FsUtils } from './fs-utils';
import { PathResolver } from './path-resolver';

export class HtmlFormatter {
  /**
   * Return content between body tags
   *
   * @param {*} topic
   * @returns {string}
   */
  static getBodyHtmlContent(topic: Topic): string {
    const dataFile = FsUtils.readFileSync(PathResolver.getDocPath() + '\\' + topic.url);
    const splitAboveBody = dataFile
      .split('<body>')
      .pop()
      .replace(/(\r\n|\n|\r|\t|&nbsp;|&#39;|\s+)/gm, ' ');
    const bodyContent = splitAboveBody.split('</body>').shift();

    return bodyContent.trim();
  }

  /**
   * Remove all html tags
   *
   * @param {*} str
   * @returns {string}
   */
  static removeTags(str: string): string {
    return str.replace(/(<([^>]+)>)/gi, '').trim();
  }

  /**
   * Format the str to be insert in regex
   *
   * @param {*} str
   * @returns {string}
   */
  static formatRegex(str: string): string {
    return '(' + str + ')';
  }
}
