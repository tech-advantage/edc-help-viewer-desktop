import { ConfigElectronViewer } from './config-electron-viewer';
import { AllowedSchema } from 'express-json-validator-middleware';
import { CorsOptions } from 'cors';

export class UrlUtils {
  /**
   * Return configuration for cors
   *
   * @returns cors
   */
  static handleCors(): CorsOptions {
    return {
      origin: [
        ConfigElectronViewer.getHostName() + ':' + ConfigElectronViewer.getServerPortConfig(),
        'http://localhost:8088',
      ],
    };
  }

  /**
   * Check if url has query params
   *
   * @param {*} url
   * @returns boolean
   */
  static hasQueryParams(url: string): Boolean {
    return url.indexOf('?') !== -1;
  }

  /**
   * Return host
   *
   * @returns {string} the host url
   */
  static getUrl(): string {
    return ConfigElectronViewer.getHostName() + ':' + ConfigElectronViewer.getServerPortConfig();
  }

  /**
   * Create url schema
   *
   * @returns urlSchema
   */
  static urlSchema(): AllowedSchema {
    return {
      type: 'object',
      required: ['url'],
      properties: {
        url: {
          type: 'string',
        },
      },
    };
  }
}
