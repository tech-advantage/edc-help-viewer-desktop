import { Dirent } from 'fs';
import { Reader } from '../docReader/reader';
import { Logger } from '../lib/logger';
import { FsUtils } from './fs-utils';
import { PathResolver } from './path-resolver';

export class TranslationUtils {
  /**
   * Return products name
   *
   * @returns products
   */
  public static getProducts(): string[] {
    const getDirectories: any = (source: string) => FsUtils.readDirSync(source, { withFileTypes: true });

    const docDocDirectories = getDirectories(PathResolver.getDocPath())
      .filter((Dirent: Dirent) => Dirent.isDirectory())
      .map((dirent: Dirent) => dirent.name);

    return docDocDirectories.filter((name: string) => name !== 'i18n');
  }

  /**
   * Return languages from info.json file
   *
   * @returns {string} languages
   */
  public static getDefaultLanguage(): string {
    const products: string[] = TranslationUtils.getProducts();
    if (products.length) {
      let defaultLanguage = JSON.parse(Reader.readInfoFile(products)).defaultLanguage;

      defaultLanguage == undefined ? (defaultLanguage = 'en') : defaultLanguage;

      Logger.log().debug('Default language: ' + defaultLanguage);

      return defaultLanguage;
    }
  }

  /**
   * Return the languages from info.json
   *
   * @returns {string} languages
   */
  public static getInfoLanguages(): string {
    const products: string[] = TranslationUtils.getProducts();
    if (products.length) {
      let languages = JSON.parse(Reader.readInfoFile(products)).languages;

      languages == undefined ? (languages = [TranslationUtils.getDefaultLanguage()]) : languages;

      return languages;
    }
  }
}
