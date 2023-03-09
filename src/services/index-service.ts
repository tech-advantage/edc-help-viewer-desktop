import { Logger } from './../lib/logger';
import lunr from 'lunr';
import Container, { Service } from 'typedi';
import { FsUtils } from '../utils/fs-utils';
import { ContentIndexer } from '../lib/lunr/content-indexer';
import { PathResolver } from '../utils/path-resolver';

@Service()
export class IndexService {
  /**
   * Create Lunr index
   */
  createIndex() {
    const contentIndexer = Container.get(ContentIndexer);
    contentIndexer.indexWriter();
  }

  /**
   * Return Lunr index
   *
   * @returns index
   */
  static getIndex(): any {
    let idxLunr;
    try {
      idxLunr = FsUtils.readFileSync(PathResolver.getLunrIndexPath());
    } catch (e) {
      Logger.log().error('Error reading index file :', e);
    }

    if (idxLunr) {
      const data = JSON.parse(idxLunr);
      const idx = lunr.Index.load(data);
      return idx;
    } else {
      return null;
    }
  }
}
