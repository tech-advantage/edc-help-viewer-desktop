const homedir = require("os").homedir();
const path = require("path");
const lunr = require("lunr");
const fs = require("fs");

const ContentIndexer = require("../utils/lunr/ContentIndexer");

class IndexService {
	static homePath = path.join(homedir, "/edc_help_viewer/index/lunr.json");

	createIndex() {
		const contentIndexer = new ContentIndexer();
		contentIndexer.indexWriter();
	}

	static getIndex() {
		let idxLunr = fs.readFileSync(IndexService.homePath, {
			encoding: "utf8",
			flag: "r",
		});

		const data = JSON.parse(idxLunr);
		const idx = lunr.Index.load(data);

		return idx;
	}
}

module.exports = IndexService;
