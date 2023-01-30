const Cache = require("file-system-cache").default;
const PathResolver = require("../utils/PathResolver");

class DocumentService {
	constructor() {
		this.docs = [];
		this.docCache = [];
	}

	/**
	 * Set documents from indexer
	 *
	 * @param {*} doc
	 */
	setDoc(doc) {
		this.docs.push(doc);
	}

	/**
	 * Return the indexed documents
	 *
	 * @returns docs
	 */
	getDocs() {
		return this.docs;
	}

	/**
	 * Create a cache with documents
	 *
	 * @param {*} doc
	 */
	setDocCache(doc) {
		const cache = Cache({
			basePath: PathResolver.getUserHome() + "/edc_help_viewer/doc",
		});
		cache.set("documents", doc);
	}

	/**
	 * Return documents from cache
	 *
	 * @returns documents
	 */
	getDocCache() {
		const cache = Cache({
			basePath: PathResolver.getUserHome() + "/edc_help_viewer/doc",
		});
		return cache.get("documents");
	}
}

class DocumentSingleton {
	constructor() {
		if (!DocumentSingleton.instance) {
			DocumentSingleton.instance = new DocumentService();
		}
	}

	getInstance() {
		return DocumentSingleton.instance;
	}
}

module.exports = DocumentSingleton;
