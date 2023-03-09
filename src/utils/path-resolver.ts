import * as path from 'path';
import { USER_HOME_DIR, APP_ROOT } from '../../conf/edc-const';
import { ConfigElectronViewer } from './config-electron-viewer';
import { UrlUtils } from './url-utils';

export class PathResolver {
  /**
   * Returns the corresponding platform icon
   * 
   * @returns {string}
   */
  static getAppIcon = (): string => {
    switch (process.platform) {
      case 'win32':
        return PathResolver.resolveFilePathMode('static/assets/building/win32/favicon.ico');
      case 'linux':
        return PathResolver.resolveFilePathMode('static/assets/building/linux/favicon.png');
      case 'darwin':
        return PathResolver.resolveFilePathMode('static/assets/building/darwin/favicon.png');
    }
  };

  /**
   * Modify the path of a file according to the mode
   * of the application (production or development)
   *
   * @param filePath
   * @returns {string}
   */
  static resolveFilePathMode(filePath: string): string {
    if (process.env.NODE_ENV === 'production') {
      return path.join(APP_ROOT, '..', filePath);
    } else {
      return path.join(APP_ROOT, filePath);
    }
  }

  /**
   * Return config_electron_viewer file path
   * 
   * @returns {string}
   */
  static getConfigViewerPath(): string {
    return PathResolver.resolveFilePathMode('conf/config_electron_viewer.json');
  }

  /**
   * Return the static path
   *
   * @returns {string}
   */
  static getStaticPath(): string {
    return PathResolver.resolveFilePathMode('/static');
  }

  /**
   * Return the static doc path
   *
   * @returns {string}
   */
  static getStaticDocPath(): string {
    return PathResolver.resolveFilePathMode(ConfigElectronViewer.getDocPathConfig());
  }

  /**
   * Return the home page path of viewer
   *
   * @returns {string}
   */
  static getHelpViewerHomePath(): string {
    return UrlUtils.getUrl() + '/help/index.html';
  }

  /**
   * Return the preload html file path
   *
   * @returns {string}
   */
  static getStaticFileLoaderPath(): string {
    return `file://${APP_ROOT}/public/index.html`;
  }

  /**
   * Return the viewer config path
   *
   * @returns {string}
   */
  static getStaticViewerConfigPath(): string {
    return APP_ROOT + '/static/help/assets/config.json';
  }

  /**
   * Return the home path
   *
   * @returns {string}
   */
  static getUserHome(): string {
    return process.env[process.platform === 'win32' ? 'USERPROFILE' : 'HOME'];
  }

  /**
   * Return css files path from help directory
   *
   * @returns {string}
   */
  static getCssFiles(): string {
    return PathResolver.resolveFilePathMode('static/help/assets/style');
  }

  /**
   * Return configElectronViewer file path
   *
   * @returns {string}
   */
  static getConfigElectronViewerPath(): string {
    return PathResolver.resolveFilePathMode('conf/config_electron_viewer.json');
  }

  /**
   * Return doc cache path
   *
   * @returns {string}
   */
  static getDocCachePath(): string {
    return path.join(USER_HOME_DIR, '/edc_help_viewer/doc');
  }

  /**
   * Return the lunr index path
   *
   * @returns {string}
   */
  static getLunrIndexPath(): string {
    return path.join(USER_HOME_DIR, '/edc_help_viewer/index/lunr.json');
  }

  /**
   * Return the doc path
   *
   * @returns {string}
   */
  static getDocPath(): string {
    const mochaPathSplit = process.argv[1].split('\\');
    return mochaPathSplit.find((argv) => argv == 'mocha') !== undefined
      ? path.join(APP_ROOT, 'src/test/resources/doc')
      : PathResolver.resolveFilePathMode(ConfigElectronViewer.getDocPathConfig());
  }

  /**
   * Return the product directory path
   *
   * @param productName
   * @returns {string}
   */
  static getProductDirPath(productName: string): string {
    return PathResolver.getDocPath() + '/' + productName;
  }

  /**
   * Return the multi-doc file path
   *
   * @returns {string}
   */
  static getMultiDocFilePath(): string {
    return PathResolver.getDocPath() + '/multi-doc.json';
  }

  /**
   * Return info file path
   *
   * @param productName
   * @returns {string}
   */
  static getInfoFilePath(productName: string): string {
    return PathResolver.getDocPath() + '/' + productName + '/info.json';
  }

  /**
   * Return toc file path
   *
   * @param productPath
   * @returns {string}
   */
  static getTocFilePath(productPath: string): string {
    return productPath + '/toc.json';
  }

  /**
   * Return toc-X file path
   *
   * @param productPath
   * @returns {string}
   */
  static getTocXFilePath(productPath: string, tocX: string): string {
    return productPath + '/' + tocX;
  }
}
