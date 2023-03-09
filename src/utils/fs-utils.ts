import * as fs from 'fs';

export class FsUtils {
  static optionReadFile: {
    encoding: 'utf8';
    flag: 'r';
  };
  /**
   * Synchronously writes data to a file
   *
   * @param {*} path
   * @param {*} data
   */
  static writeFileSync(path: string, data: string): void {
    fs.writeFileSync(path, data);
  }

  /**
   * Return information about the given file or directory
   *
   * @param {*} path
   * @returns {fs.Stats}
   */
  static getStatsSync(path: string): fs.Stats {
    return fs.statSync(path);
  }

  /**
   * Return the opened directory synchronously
   *
   * @param {*} path
   * @returns {fs.Dir}
   */
  static openDirSync(path: string): fs.Dir {
    return fs.opendirSync(path);
  }

  /**
   * Return the entire contents of readed file synchronously
   *
   * @param {*} path
   * @param {*} option
   * @returns {string}
   */
  static readFileSync(path: string): string {
    return fs.readFileSync(path, FsUtils.optionReadFile).toString();
  }

  /**
   * Return a directory readed synchronously
   *
   * @param {*} path
   * @returns {string[]}
   */
  static readDirSync(path: any, options: any): string[] {
    return fs.readdirSync(path, options);
  }
}
