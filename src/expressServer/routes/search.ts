import express, { Request, Response, Router } from 'express';
import { Logger } from '../../lib/logger';
import { TranslationUtils } from '../../utils/translation-utils';
import { ContentSearcher } from '../../lib/lunr/content-searcher';
import { UrlUtils } from '../../utils/url-utils';
import Container from 'typedi';
import { Documents } from '../../global/types';
const contentSearcher = Container.get(ContentSearcher);
const searchRouter: Router = express.Router();
let message: string = '';

searchRouter.get('/search', (req: Request, res: Response) => {
  if (UrlUtils.hasQueryParams(req.url) == false) {
    message = 'Query parameters are missing';
    res.status(400).json({ message });
  }
  const query: string = req.query.query as string;
  let matchCase: any = req.query['match-case'];
  let matchWholeWord: any = req.query['match-whole-word'];

  matchWholeWord = matchWholeWord == undefined ? false : matchWholeWord != 'false';
  matchCase = matchCase == undefined ? false : matchCase != 'false';

  const lang = req.query.lang.length == 0 ? TranslationUtils.getDefaultLanguage() : req.query.lang;

  const maxResultNumber: number = parseInt(req.query['max-result-number'] as string);

  const getSearchResults: Documents = contentSearcher.getSearchResults(
    query,
    lang.toString(),
    matchWholeWord,
    matchCase,
    maxResultNumber
  );

  res.setHeader('Content-Type', 'application/json');
  if (res.statusCode === 500) {
    Logger.log().error(req, res);
    res.send('Internal Server Error');
  } else if (res.statusCode === 404) {
    message = 'Unable to find the requested resource ! You can try another URL.';
    res.status(404).json({ message });
  }

  res.status(200).json(getSearchResults);
});

export default searchRouter;
