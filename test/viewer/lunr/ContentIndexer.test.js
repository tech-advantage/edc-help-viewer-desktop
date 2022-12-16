const expect = require("chai").expect;
const IndexService = require("../../../src/service/IndexService");
const ConfigElectronViewer = require("../../../src/utils/ConfigElectronViewer");
const ContentIndexer = require("../../../src/utils/lunr/ContentIndexer");

describe("Testing the indexer", () => {
	it("Should index documentation", (done) => {
		const indexService = new IndexService();
		indexService.createIndex();

		expect(ContentIndexer.documents.length).to.equal(32);
		done();
	});
});
