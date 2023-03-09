import { expect } from 'chai';
import Container from 'typedi';
import { DocumentService } from '../../../services/document-service';
import { IndexService } from '../../../services/index-service';

const docService = Container.get(DocumentService);
const indexService = Container.get(IndexService);

describe('Testing the indexer', () => {
  it('Should index documentation', (done) => {
    indexService.createIndex();

    expect(docService.getDocuments().length).to.equal(32);
    done();
  });
});
