const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../../../src/server");
const should = chai.should();

chai.use(chaiHttp);

describe("/GET documents", () => {
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
			.post(
				"/httpd/api/help/context/webmailmain/fr.techad.edc/text_editor/en/0",
			)
			.end((err, res) => {
				res.should.have.status(200);
				done();
			});
	});
});
