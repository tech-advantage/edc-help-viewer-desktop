import * as configViewer from '../../conf/config_electron_viewer.json';
import { FsUtils } from './fs-utils';
import { DateUtils } from './date-utils';
import { APP_ROOT } from '../../conf/edc-const';

export class ConfigElectronViewer {
  static getConfigViewerObject() {
    return JSON.parse(FsUtils.readFileSync(APP_ROOT + '/conf/config_electron_viewer.json'));
  }

  /**
   * Return true if the given string is empty
   *
   * @param {*} str
   * @returns {boolean}
   */
  static isEmpty(str: string): boolean {
    return !str || str.length === 0;
  }

  /**
   * Return the host name
   *
   * @returns {string}
   */
  static getHostName(): string {
    return ConfigElectronViewer.isEmpty(configViewer.hostname) ? 'http://localhost' : configViewer.hostname;
  }

  /**
   * Return the server port number
   *
   * @returns {number}
   */
  static getServerPortConfig(): number {
    if (!configViewer.serverPort) {
      return 60000;
    }
    if (typeof configViewer.serverPort === 'string') {
      return parseInt(configViewer.serverPort);
    }

    return configViewer.serverPort;
  }

  /**
   * Return the doc path config
   *
   * @returns {string}
   */
  static getDocPathConfig(): string {
    return configViewer.docPath;
  }

  /**
   * Update doc last updated field
   *
   * @param {*} path
   * @param {*} key
   * @param {*} value
   */
  static updateLastUpdatedDoc(path: string, mtimeMs: number): void {
    const configElectronFile = FsUtils.readFileSync(path);
    var configElectronObj = JSON.parse(configElectronFile);

    configElectronObj['docLastUpdated'] = DateUtils.getUpdatedAtDoc(mtimeMs);
    FsUtils.writeFileSync(path, JSON.stringify(configElectronObj, null, 4));
  }

  /**
   * Return the last updated date of doc directory
   *
   * @returns {string}
   */
  static getLastUpdatedDocConfig(path: string): string {
    const configElectronFile = FsUtils.readFileSync(path);
    var configElectronObj = JSON.parse(configElectronFile);

    return configElectronObj['docLastUpdated'];
  }

  /**
   * Return true if enable
   *
   * @returns {boolean}
   */
  static isEmbeddedDocConfig(): boolean {
    return !!configViewer.isEmbeddedDoc;
  }

  /**
   * Return true if enable
   *
   * @returns {boolean}
   */
  static isEnableMenuConfig(): boolean {
    return !!configViewer.browserWindow.isEnableMenu;
  }

  /**
   * Return the viewer img loader
   *
   * @returns {string} the viewer img loader
   */
  static getImgLoaderConfig(): string {
    return configViewer.imgLoader;
  }

  /**
   * The width of browser window
   *
   * @returns {number} browserWindow width
   */
  static getBrowserWindowWidthConfig(): number {
    return configViewer.browserWindow.width;
  }

  /**
   * The height of browser window
   *
   * @returns {number} browserWindow height
   */
  static getBrowserWindowHeightConfig(): number {
    return configViewer.browserWindow.height;
  }
}
