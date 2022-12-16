const ContentIndexer = require("../utils/lunr/ContentIndexer");

class IndexService {
	createIndex() {
		const contentIndexer = new ContentIndexer();
		contentIndexer.indexWriter();
	}
}

module.exports = IndexService;
