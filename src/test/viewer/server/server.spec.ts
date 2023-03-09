import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
chai.use(chaiHttp);
import { server } from '../../../../src/expressServer/server';
import Container from 'typedi';
import { ContentIndexer } from '../../../lib/lunr/content-indexer';

const contentIndexer = Container.get(ContentIndexer);
contentIndexer.indexWriter();

describe('/GET documents', () => {
  it('Should search storehouse', (done) => {
    chai
      .request(server())
      .get('/httpd/api/search?query=storehouse&lang=en&match-whole-word=false&match-case=false&max-result-number=25')
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.length).to.equal(11);
        done();
      });
  });
});

describe('/POST viewer', () => {
  it('Should post request', (done) => {
    chai
      .request(server())
      .post('/httpd/api/help/context/edc/fr.techad.edc/text_editor/en/0')
      .end((err, res) => {
        expect(res.status).to.equal(200);
        done();
      });
  });
});
