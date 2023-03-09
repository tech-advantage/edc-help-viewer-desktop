import * as bodyParser from 'body-parser';
import express from 'express';
const serverApp = express();
import cors from 'cors';
import { Container } from 'typedi';
import 'reflect-metadata';
import { Stats } from 'fs';
import { Logger } from '../lib/logger';
import { ConfigElectronViewer } from '../utils/config-electron-viewer';
import viewerRouter from './routes/viewer';
import searchRouter from './routes/search';
import { UrlUtils } from '../utils/url-utils';
import { DateUtils } from '../utils/date-utils';
import { PathResolver } from '../utils/path-resolver';
import { FsUtils } from '../utils/fs-utils';
import { DocumentService } from '../services/document-service';
import { IndexService } from '../services/index-service';

const docService = Container.get(DocumentService);

Logger.log().info('Server started');

serverApp.use(bodyParser.json()).use(express.static(PathResolver.getStaticPath())).use(cors(UrlUtils.handleCors()));

function createIndex(): void {
  const indexService = Container.get(IndexService);
  indexService.createIndex();
}

/**
 * Insert the documents to the documents variable
 */
function initDoc(): void {
  docService.getDocCache().then((documents) => {
    docService.addDocs(documents);
  });
}

/**
 * Rewrite Index if doc was changed
 *
 * @param {*} documents
 */
function rewriteIndexWithNewDoc(documents: any) {
  const docPath: string = PathResolver.getStaticDocPath();

  const stats: Stats = FsUtils.getStatsSync(docPath);

  if (
    DateUtils.getUpdatedAtDoc(stats.mtimeMs) !==
      ConfigElectronViewer.getLastUpdatedDocConfig(PathResolver.getConfigElectronViewerPath()) ||
    documents == null
  ) {
    // If the documentation directory has changed we update the last update date and then we create an index
    ConfigElectronViewer.updateLastUpdatedDoc(PathResolver.getConfigElectronViewerPath(), stats.mtimeMs);

    docService.cacheClear();
    // If the documentation directory has changed then we create an index
    createIndex();
  }
}
// POST Request sended by the help viewer to redirect to the clicked link from the popover
serverApp.use('/api', viewerRouter);

if (ConfigElectronViewer.isEmbeddedDocConfig()) {
  initDoc();
  const openDir = FsUtils.openDirSync(PathResolver.getDocCachePath());

  openDir
    .read()
    .then((documents) => {
      rewriteIndexWithNewDoc(documents);
    })
    .catch((err) => {
      Logger.log().error(err);
    });

  // GET Request to find search content
  serverApp.use('/httpd/api', searchRouter);
}

serverApp.use(({ res }) => {
  res.send('Chargement ...');
});

export const server = () =>
  serverApp.listen(ConfigElectronViewer.getServerPortConfig(), () => {
    Logger.log().info(`Server listening on port : ${ConfigElectronViewer.getServerPortConfig()}`);
  });
