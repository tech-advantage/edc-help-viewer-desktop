const homedir = require("os").homedir();
const path = require("path");
const lunr = require("lunr");

const ContentIndexer = require("../utils/lunr/ContentIndexer");
const FsUtils = require("../utils/FsUtils");
const PathResolver = require("../utils/PathResolver");

class IndexService {
	/**
	 * Create Lunr index
	 */
	createIndex() {
		const contentIndexer = new ContentIndexer();
		contentIndexer.indexWriter();
	}

	/**
	 * Return Lunr index
	 *
	 * @returns index
	 */
	static getIndex() {
		let idxLunr = FsUtils.readFileSync(PathResolver.getLunrIndex(), {
			encoding: "utf8",
			flag: "r",
		});

		const data = JSON.parse(idxLunr);
		const idx = lunr.Index.load(data);

		return idx;
	}
}

module.exports = IndexService;
