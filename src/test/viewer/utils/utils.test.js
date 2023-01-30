const expect = require("chai").expect;
const DateUtils = require("../../../utils/DateUtils");
const HtmlFormatter = require("../../../utils/HtmlFormatter");
const LangUtils = require("../../../utils/LangUtils");

const htmlString =
	'<h2 class="title"> Topology</h2> ' +
	'<section class="document-content">  ' +
	'<article class="article-content">Article type.</article> ' +
	"</section> <br/> " +
	'<div class="footer">' +
	"</div>";

describe("Test DateUtils file", () => {
	it("Should convert unix timestamp to ISO String", (done) => {
		const timestamp = DateUtils.getUpdatedAtDoc(1674116218041.9429);
		expect(timestamp).to.equal("2023-01-19T08:16:58.041Z");
		done();
	});
});

describe("Test LangUtils file", () => {
	it("Should return the product", (done) => {
		const products = LangUtils.getProducts();
		expect(products.length).to.equal(1);
		expect(products[0]).to.equal("edc");
		done();
	});

	it("Should return the languages from info.json", (done) => {
		const infoFileLanguages = LangUtils.getInfoLanguages();
		expect(infoFileLanguages.length).to.equal(1);
		expect(infoFileLanguages[0]).to.equal("en");
		done();
	});

	it("Should return the default language from info.json", (done) => {
		const defaultLanguage = LangUtils.getDefaultLanguage();
		expect(defaultLanguage).to.equal("en");
		done();
	});
});

describe("Test HtmlFormatter file", () => {
	it("Should get the body html content string", (done) => {
		const tocObject = {
			id: "84",
			label: "Topology",
			type: "DOCUMENT",
			url: "edc/html/en/7/84.html",
			topics: [],
			links: [],
		};

		const bodyContent = HtmlFormatter.getBodyHtmlContent(tocObject);

		expect(bodyContent).to.equal(htmlString);
		done();
	});

	it("Should remove html tags", (done) => {
		const tocText = "Topology   Article type.";
		const text = HtmlFormatter.removeTags(htmlString);

		expect(text).to.equal(tocText);
		done();
	});
});
