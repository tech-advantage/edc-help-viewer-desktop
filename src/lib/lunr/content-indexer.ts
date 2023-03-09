import lunr from 'lunr';
import 'reflect-metadata';
import { Service } from 'typedi';
import { HtmlFormatter } from '../../utils/html-formatter';
import { Logger } from '../logger';
import { PathResolver } from '../../utils/path-resolver';
import { TranslationUtils } from '../../utils/translation-utils';
import { FsUtils } from '../../utils/fs-utils';
import { DocumentService } from '../../services/document-service';
import { Document, Documents, IndexMetadata, TocContent, TocRef, Topics } from '../../global/types';
import { Reader } from '../../docReader/reader';

@Service()
export class ContentIndexer {
  static documents: Documents = [];
  private docService: DocumentService;

  constructor(private documentService: DocumentService) {
    this.docService = documentService;
  }

  /**
   * Set toc reference
   */
  tocIndexer(): void {
    const productsData: any[] = Reader.readMultiDocItem().map((multidoc) => {
      const productDirPath = PathResolver.getProductDirPath(multidoc.pluginId);
      const productDir: any = {
        productPath: productDirPath,
      };
      try {
        productDir.tocFile = JSON.parse(FsUtils.readFileSync(PathResolver.getTocFilePath(productDirPath)));
      } catch (e) {
        Logger.log().error('Toc files for the given product not found', e);
      }
      return productDir;
    });

    productsData.forEach((product) => {
      const tocFile = product.tocFile;
      if (tocFile) {
        tocFile.toc.forEach((toc: TocRef) => {
          this.indexTocReference(product.productPath, toc);
        });
      }
    });
  }

  /**
   * Get the nested content of topics nodes
   *
   * @param {*} contents
   * @param {*} existingChildren
   * @param {*} strategyId
   * @param {*} strategyLabel
   * @param {*} languageCode
   * @returns topics content
   */
  static getContentOfTopicsNodes(
    contents: Topics,
    existingChildren: Topics[],
    strategyId: number,
    strategyLabel: string,
    languageCode: string
  ): Topics[] {
    contents.forEach((toc) => {
      const topicObject: Document = {
        id: toc.id,
        label: toc.label,
        url: toc.url,
        strategyId,
        strategyLabel,
        type: toc.type,
        languageCode,
        content: HtmlFormatter.removeTags(HtmlFormatter.getBodyHtmlContent(toc)),
      };

      Logger.log().debug(
        'Help document to index: id: ' +
          topicObject.id +
          ', label: ' +
          topicObject.label +
          ', url: ' +
          topicObject.url +
          ', type: ' +
          topicObject.type +
          ', languageCode: ' +
          topicObject.languageCode +
          ''
      );
      // Adding indexed doc to the service
      ContentIndexer.documents.push(topicObject);

      existingChildren.push(toc.topics);
      toc.topics &&
        ContentIndexer.getContentOfTopicsNodes(toc.topics, existingChildren, strategyId, strategyLabel, languageCode);
    });

    return existingChildren;
  }

  /**
   * Set the content of topics nodes
   *
   * @param {*} productDir
   * @param {*} tocReference
   */
  private indexTocReference(productDir: string, tocReference: TocRef): void {
    const tocXjsonFile = PathResolver.getTocXFilePath(productDir, tocReference.file);

    if (tocXjsonFile) {
      const tocJsonFile = JSON.parse(FsUtils.readFileSync(tocXjsonFile));
      const strategyId: number = tocJsonFile.id;
      let languageCode: string;
      let strategyLabel: string = null;
      let tocValue: TocContent = null;

      Object.keys(tocJsonFile).forEach(function (key: string) {
        if (key !== 'id') {
          languageCode = key;
          tocValue = tocJsonFile[key];
          strategyLabel = tocValue.label;
          ContentIndexer.getContentOfTopicsNodes(tocValue.topics, [], strategyId, strategyLabel, languageCode);
        }
      });
    }
  }

  buildLunrIndex(tokenizer: any, tokenMetadata: any, languageMetadata: any, documents: any) {
    const lunrIndex: lunr.Index = lunr(function () {
      this.tokenizer = tokenizer;

      this.use(tokenMetadata);
      this.use(languageMetadata);

      this.field('content');
      this.field('languageCode');
      this.ref('id');

      this.pipeline.remove(lunr.stopWordFilter);
      this.pipeline.remove(lunr.stemmer);
      this.pipeline.remove(lunr.trimmer);
      this.searchPipeline.remove(lunr.stemmer);
      this.searchPipeline.remove(lunr.trimmer);

      documents.forEach(function (doc: any) {
        this.add(doc);
      }, this);
    });

    return lunrIndex;
  }

  /**
   * Create and write the lunr index
   */
  indexWriter(): void {
    const infoLangugage: string = TranslationUtils.getInfoLanguages();
    this.docService.addDocs(ContentIndexer.documents);
    this.tocIndexer();
    const metadata: IndexMetadata = {
      content: '',
      languageCode: '',
    };
    var caseSensitiveTokenizer = function (obj?: null | string | object | object[]) {
      var str = obj.toString();
      var tokens = [];

      if (infoLangugage.indexOf(str) !== -1) {
        metadata.languageCode = str;
      } else {
        metadata.content = str;
      }

      for (let word of metadata.content.split(/\s+/)) {
        word = word.replace(/[.,\/#!$%\^&\*;:{}=\\_`~()]/g, '');

        tokens.push(
          new lunr.Token(word.toLowerCase(), {
            index: tokens.length,
            originalToken: word.replace(/[!.]/gi, ''),
            languageCode: metadata.languageCode,
          })
        );
      }
      return tokens;
    };

    const pagesIndex: Documents = this.docService.getDocuments();

    this.docService.setDocCache(pagesIndex);

    const lunrIndex = this.buildLunrIndex(
      caseSensitiveTokenizer,
      addOriginalTokenMetadata,
      addLanguageCodeMetadata,
      pagesIndex
    );

    function addOriginalTokenMetadata(builder: any): void {
      builder.metadataWhitelist.push('originalToken');
    }

    function addLanguageCodeMetadata(builder: any): void {
      builder.metadataWhitelist.push('languageCode');
    }

    const indexedContent: string = JSON.stringify(lunrIndex, null, 4);

    FsUtils.writeFileSync(PathResolver.getLunrIndexPath(), indexedContent);
  }
}
