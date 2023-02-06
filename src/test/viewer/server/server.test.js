const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../../../expressServer/server");
const should = chai.should();
const ContentSearcher = require("../../../utils/lunr/ContentSearcher");
const DocumentService = require("../../../service/DocumentService");
var docService = new DocumentService().getInstance();

chai.use(chaiHttp);

function getDocdc() {
	ContentSearcher.documents = docService.getDocs();
}

describe("/GET documents", () => {
	beforeEach(async function () {
		getDocdc();
	});

	it("Should search storehouse", (done) => {
		chai
			.request(server)
			.get(
				"/httpd/api/search?query=storehouse&lang=en&match-whole-word=false&match-case=false&max-result-number=25",
			)
			.end((err, res) => {
				res.should.have.status(200);
				res.body.should.be.a("array");
				res.body.length.should.be.eql(11);
				done();
			});
	});
});

describe("/POST viewer", () => {
	it("Should post request", (done) => {
		chai
			.request(server)
			.post("/httpd/api/help/context/edc/fr.techad.edc/text_editor/en/0")
			.end((err, res) => {
				res.should.have.status(200);
				done();
			});
	});
});
