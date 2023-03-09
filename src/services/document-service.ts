import Cache from 'file-system-cache';
import 'reflect-metadata';
import { Service } from 'typedi';
import { Documents } from '../global/types';
import { PathResolver } from '../utils/path-resolver';

@Service()
export class DocumentService {
  private documents: Documents = [];
  static cache = Cache({
    basePath: PathResolver.getDocCachePath(),
  });

  /**
   * Set documents from indexer
   *
   * @param {*} doc
   */
  addDocs(documents: Documents) {
    this.documents = documents;
  }

  /**
   * Return the indexed documents
   *
   * @returns docs
   */
  getDocuments(): Documents {
    return this.documents;
  }

  /**
   * Create a cache with documents
   *
   * @param {*} doc
   */
  setDocCache(doc: Documents) {
    DocumentService.cache.set('documents', doc);
  }

  /**
   * Return documents from cache
   *
   * @returns documents
   */
  getDocCache(): Promise<Documents> {
    return DocumentService.cache.get('documents');
  }

  /**
   * Clear the cache
   */
  cacheClear(): void {
    DocumentService.cache.clear();
  }

  /**
   * Remove documents
   */
  removeDocuments() {
    this.documents = [];
  }
}
