const ipc = require("electron").ipcRenderer;
const express = require("express");
const { Validator } = require("express-json-validator-middleware");
const Logger = require("../../lib/Logger");
const ConfigElectronViewer = require("../../utils/ConfigElectronViewer");
const UrlUtils = require("../../utils/UrlUtils");
const { validate } = new Validator();
const viewerRouter = express.Router();

let loaderMessage = "Loading ...";
let message = "";

viewerRouter.post(
	"/viewerurl",
	validate({ body: UrlUtils.urlSchema() }),
	(req, res) => {
		const splitUrl = req.body.url.split("/");
		const languageCode = splitUrl[splitUrl.length - 1];
		const viewerUrl = new URL(req.body.url);

		res.setHeader("Content-Type", "application/json");

		if (res.status == 500) {
			Logger.log().error(req, res);
			res.send("Internal Server Error");
		} else if (res.status == 404) {
			message =
				"Unable to find the requested resource ! You can try another URL.";
			res.status(404).json({ message });
		}

		if (parseInt(viewerUrl.port) !== ConfigElectronViewer.getServerPort()) {
			viewerUrl.port = ConfigElectronViewer.getServerPort();
		}

		ipc.send("requested-url", viewerUrl.toString());

		if (languageCode === "fr") {
			loaderMessage = "Chargement ...";
		}

		Logger.log().debug(
			`POST request body ${JSON.stringify({
				url: req.body.url,
			})} was sending succesfully`,
		);
		res.send(
			`POST request body ${JSON.stringify({
				url: req.body.url,
			})} was sending succesfully`,
		);
	},
);

module.exports = viewerRouter;
