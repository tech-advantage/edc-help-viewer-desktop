export type Document = {
  /**
   * Document id
   */
  id: number;
  /**
   * Document label
   */
  label: string;
  /**
   * Document url
   */
  url: string;
  /**
   * Document type
   */
  type: string;
  /**
   * Document language code
   */
  languageCode: string;
  /**
   * Document strategy id
   */
  strategyId?: number;
  /**
   * Document strategy label
   */
  strategyLabel?: string;
  /**
   * Document content
   */
  content?: string;
};

/**
 * An array of documents
 */
export type Documents = Document[];

export type Topic = {
  /**
   * Topic id
   */
  id: number;
  /**
   * Topic string
   */
  label: string;
  /**
   * Topic url
   */
  url: string;
  /**
   * Topic type
   */
  type: string;
  /**
   * Topic array of topic
   */
  topics?: Topic[];
  /**
   * Topic array of link
   */
  links?: Link[];
};

export type Link = {
  /**
   * Link id
   */
  id: number;
  /**
   * Link string
   */
  label: string;
  /**
   * Link url
   */
  url: string;
};

/**
 * An array of Topics
 */
export type Topics = Topic[];

export type MultiDocItem = {
  /**
   * The id of the product from the multi-doc.json file
   */
  productId: string;
  /**
   * The id of the plugin from the multi-doc.json file
   */
  pluginId: string;
};

export type TocContent = {
  label: string;
  topics: Topic[];
};

export type TocRef = {
  /**
   * Reference id of the toc file
   */
  id: number;
  /**
   * Extension of the toc file
   */
  file: string;
};

export type TocRefs = TocRef[];

/**
 * An array of mutli-doc item objet
 */
export type MultiDocItems = MultiDocItem[];

export type Hit = {
  /**
   * Lunr index ref
   */
  ref: number;
  /**
   * Score of the document
   */
  score: number;
  /**
   * Metadata about document
   */
  matchData: any;
};

export type IndexMetadata = {
  /**
   * Content metadata
   */
  content: string;
  /**
   * LanguageCode metadata
   */
  languageCode: string;
};
