import { ipcRenderer } from 'electron';
import express, { Request, Response } from 'express';
import { Validator } from 'express-json-validator-middleware';
import { Logger } from '../../lib/logger';
import { UrlUtils } from '../../utils/url-utils';
import { ConfigElectronViewer } from '../../utils/config-electron-viewer';
const { validate } = new Validator(null);
const viewerRouter: express.Router = express.Router();

let message: string = '';

viewerRouter.post('/helpviewer', validate({ body: UrlUtils.urlSchema() }), (req: Request, res: Response) => {
  const viewerUrl: URL = new URL(req.body.url);

  res.setHeader('Content-Type', 'application/json');

  if (res.statusCode == 500) {
    Logger.log().error(req, res);
    res.send('Internal Server Error');
  } else if (res.statusCode == 404) {
    message = 'Unable to find the requested resource ! You can try another URL.';
    res.status(404).json({ message });
  }

  if (parseInt(viewerUrl.port) !== ConfigElectronViewer.getServerPortConfig()) {
    viewerUrl.port = ConfigElectronViewer.getServerPortConfig().toString();
  }

  ipcRenderer.send('requested-url', viewerUrl.toString());

  Logger.log().debug(
    `POST request body ${JSON.stringify({
      url: req.body.url,
    })} was sending succesfully`
  );
  res.send(
    `POST request body ${JSON.stringify({
      url: req.body.url,
    })} was sending succesfully`
  );
});

viewerRouter.post('/helpviewer/shutdown', (req: Request, res: Response) => {
  const shutDown: boolean = req.body.shutDown;

  res.setHeader('Content-Type', 'application/json');

  if (res.statusCode == 500) {
    Logger.log().error(req, res);
    res.send('Internal Server Error');
  } else if (res.statusCode == 404) {
    message = 'Unable to find the requested resource ! You can try another URL.';
    res.status(404).json({ message });
  }

  ipcRenderer.send('shutdown', shutDown);

  res.send(
    `Application is shutdown`
  );
})

export default viewerRouter;
