const expect = require("chai").expect;
const IndexService = require("../../../service/IndexService");
const DocumentService = require("../../../service/DocumentService");
var docService = new DocumentService().getInstance();

describe("Testing the indexer", () => {
	it("Should index documentation", (done) => {
		const indexService = new IndexService();
		indexService.createIndex();

		expect(docService.getDocs().length).to.equal(32);
		done();
	});
});
