import { expect } from 'chai';
import 'reflect-metadata';
import Container from 'typedi';
import { ContentSearcher } from '../../../lib/lunr/content-searcher';
import { ContentIndexer } from '../../../lib/lunr/content-indexer';

const contentIndexer = Container.get(ContentIndexer);
contentIndexer.indexWriter();

function getContentSearcher() {
  return Container.get(ContentSearcher);
}

describe('Testing getSearchResults function with match case and match whole word value', () => {
  it('Should search storehouse exact match', (done) => {
    const listResult = getContentSearcher().getSearchResults('storehouse', 'en', true, false, 25);
    expect(listResult.length).to.equal(11);
    done();
  });

  it('Should exact match search with word "instance"', (done) => {
    const listResult = getContentSearcher().getSearchResults('instance', 'en', true, false, 25);
    expect(listResult.length).to.equal(3);
    done();
  });

  it('Should not return result with exact match value to true', (done) => {
    const listResult = getContentSearcher().getSearchResults('inst', 'en', true, false, 25);
    expect(listResult.length).to.equal(0);
    done();
  });

  it('Should search Product Match case', (done) => {
    const listResult = getContentSearcher().getSearchResults('Product', 'en', true, true, 25);
    expect(listResult.length).to.equal(5);
    done();
  });

  it('Should search Product with first letter capitalize', (done) => {
    const listResult = getContentSearcher().getSearchResults('Product', 'en', false, false, 25);
    expect(listResult.length).to.equal(12);
    done();
  });

  it('Should search product', (done) => {
    const listResult = getContentSearcher().getSearchResults('product', 'en', false, false, 25);
    expect(listResult.length).to.equal(12);
    done();
  });

  it('Should search Product with first letter capitalize and Match case set to true', (done) => {
    const listResult = getContentSearcher().getSearchResults('Product', 'en', false, true, 25);
    expect(listResult.length).to.equal(7);
    done();
  });
});

describe('Testing getSearchResults function with max result number value', () => {
  it('Should return numbers of documents equal to the number define in getSearchResults param', (done) => {
    const listResult = getContentSearcher().getSearchResults('storehouse', 'en', false, false, 2);
    expect(listResult.length).to.equal(2);
    done();
  });

  it('Should return numbers of documents equal to the number define in getSearchResults param', (done) => {
    const listResult = getContentSearcher().getSearchResults('storehouse', 'en', false, false, 11);
    expect(listResult.length).to.equal(11);
    done();
  });
});

describe('Testing getSearchResults function with two words searched', () => {
  it('Should return documents containing both words entered in the searchBar - MatchWholeWord: true, MatchCase: true', (done) => {
    const listResult = getContentSearcher().getSearchResults('involving test', 'en', true, true, 25);
    expect(listResult.length).to.equal(1);
    done();
  });

  it('Should return documents containing both words entered in the searchBar', (done) => {
    const listResult = getContentSearcher().getSearchResults('storehouse managers', 'en', false, false, 25);
    expect(listResult.length).to.equal(3);
    done();
  });

  it("Should not return documents because they're not containing both words entered in the searchBar  - MatchWholeWord: false, MatchCase: false", (done) => {
    const listResult = getContentSearcher().getSearchResults('storehouse undefined', 'en', false, false, 25);
    expect(listResult.length).to.equal(0);
    done();
  });

  it('Should return documents containing both words entered in the searchBar - MatchWholeWord: false, MatchCase: true', (done) => {
    const listResult = getContentSearcher().getSearchResults('storeho managers', 'en', false, true, 25);
    expect(listResult.length).to.equal(0);
    done();
  });

  it("Should not return documents because they're not containing both words entered in the searchBar - MatchWholeWord: true, MatchCase: true", (done) => {
    const listResult = getContentSearcher().getSearchResults('storehouse Managers', 'en', true, true, 25);
    expect(listResult.length).to.equal(2);
    done();
  });
});
