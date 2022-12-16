const expect = require("chai").expect;
const ConfigElectronViewer = require("../../../src/utils/ConfigElectronViewer");
const ContentSearcher = require("../../../src/utils/lunr/ContentSearcher");

function getContentSearcher() {
	return new ContentSearcher();
}

describe("Testing getSearchResults function with match case and match whole word value", () => {
	it("Should search storehouse", (done) => {
		const listResult = getContentSearcher().getSearchResults(
			"storehouse",
			"en",
			true,
			false,
			25,
		);
		expect(listResult.length).to.equal(11);
		done();
	});

	it('Should exact match search with word "instance" ', (done) => {
		const listResult = getContentSearcher().getSearchResults(
			"instance",
			"en",
			true,
			false,
			25,
		);
		expect(listResult.length).to.equal(3);
		done();
	});

	it("Should not return result with exact match value to true", (done) => {
		const listResult = getContentSearcher().getSearchResults(
			"inst",
			"en",
			true,
			false,
			25,
		);
		expect(listResult.length).to.equal(0);
		done();
	});

	it("Should search Product Match case", (done) => {
		const listResult = getContentSearcher().getSearchResults(
			"Product",
			"en",
			true,
			true,
			25,
		);
		expect(listResult.length).to.equal(5);
		done();
	});

	it("Should search Product with first letter capitalize", (done) => {
		const listResult = getContentSearcher().getSearchResults(
			"Product",
			"en",
			false,
			false,
			25,
		);
		expect(listResult.length).to.equal(12);
		done();
	});

	it("Should search product", (done) => {
		const listResult = getContentSearcher().getSearchResults(
			"product",
			"en",
			false,
			false,
			25,
		);
		expect(listResult.length).to.equal(12);
		done();
	});

	it("Should search Product with first letter capitalize and Match case", (done) => {
		const listResult = getContentSearcher().getSearchResults(
			"Product",
			"en",
			false,
			true,
			25,
		);
		expect(listResult.length).to.equal(7);
		done();
	});

	it("Should return documents containing two consecutive words", (done) => {
		const listResult = getContentSearcher().getSearchResults(
			"involving test",
			"en",
			true,
			true,
			25,
		);
		expect(listResult.length).to.equal(1);
		done();
	});

	it("Should return documents containing both words entered in the search", (done) => {
		const listResult = getContentSearcher().getSearchResults(
			"storehouse managers",
			"en",
			false,
			false,
			25,
		);
		expect(listResult.length).to.equal(3);
		done();
	});

	it("Should return documents containing both words entered in the search Match Case and Match Whole Word", (done) => {
		const listResult = getContentSearcher().getSearchResults(
			"storehouse managers",
			"en",
			true,
			true,
			25,
		);
		expect(listResult.length).to.equal(3);
		done();
	});

	it("Should return documents containing both words entered in the search - Match Whole Word equal false and Match Case equal true", (done) => {
		const listResult = getContentSearcher().getSearchResults(
			"storeho managers",
			"en",
			false,
			true,
			25,
		);
		expect(listResult.length).to.equal(3);
		done();
	});

	it("Should not return documents because they're not containing both words entered in the search", (done) => {
		const listResult = getContentSearcher().getSearchResults(
			"storehouse undefined",
			"en",
			false,
			false,
			25,
		);
		expect(listResult.length).to.equal(0);
		done();
	});

	it("Should not return documents because they're not containing both words entered in the search Match Case and Match Whole Word", (done) => {
		const listResult = getContentSearcher().getSearchResults(
			"storehouse Managers",
			"en",
			true,
			true,
			25,
		);
		expect(listResult.length).to.equal(2);
		done();
	});
});

describe("Testing getSearchResults function with max result number value", () => {
	it("Should return numbers of documents equal to the number define in getSearchResults param", (done) => {
		const listResult = getContentSearcher().getSearchResults(
			"storehouse",
			"en",
			false,
			false,
			2,
		);
		expect(listResult.length).to.equal(2);
		done();
	});

	it("Should return numbers of documents equal to the number define in getSearchResults param", (done) => {
		const listResult = getContentSearcher().getSearchResults(
			"storehouse",
			"en",
			false,
			false,
			25,
		);
		expect(listResult.length).to.equal(11);
		done();
	});
});
