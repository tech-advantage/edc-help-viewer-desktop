import admZip from 'adm-zip';
import { APP_ROOT } from '../conf/edc-const';
import { FsUtils } from '../src/utils/fs-utils';
import { Logger } from '../src/lib/logger';

export const unzipViewer = (): void => {
  // Read the content of the given directory
  Logger.log().info(APP_ROOT + " app root de l'extraction");
  const zipPath = APP_ROOT + '/dist/zip';
  // Read the archive
  const zip = new admZip(zipPath + '/' + FsUtils.readDirSync(zipPath, null));

  try {
    Logger.log().info('%c start unzip', 'color: green');
    // Extracts the entire archive to the given location.
    zip.extractAllTo(APP_ROOT, true);
  } catch (e) {
    Logger.log().error(e, 'color: red');
  }
};
