import { MultiDocItem, MultiDocItems } from '../global/types';
import { Logger } from '../lib/logger';
import { FsUtils } from '../utils/fs-utils';
import { PathResolver } from '../utils/path-resolver';

export class Reader {
  /**
   * Return the content of info.json file
   *
   * @param {*} products
   */
  static readInfoFile(products: string[]): any {
    return FsUtils.readFileSync(PathResolver.getInfoFilePath(products[0]));
  }

  /**
   * Return multidoc content
   *
   * @returns {string}
   */
  static readMultiDocItem() {
    const multiDocFile = JSON.parse(FsUtils.readFileSync(PathResolver.getMultiDocFilePath()));
    const multiDocItems: MultiDocItems = [];
    for (const multiDoc of multiDocFile) {
      const multiDocObject: MultiDocItem = {
        productId: multiDoc.productId,
        pluginId: multiDoc.pluginId,
      };

      multiDocItems.push(multiDocObject);

      Logger.log().debug('Product ID = ' + multiDocObject.productId + ', Plugin ID = ' + multiDocObject.pluginId + ';');
    }
    return multiDocItems;
  }
}
