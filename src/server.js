const ipc = require("electron").ipcRenderer;
const express = require("express");
const { Validator } = require("express-json-validator-middleware");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const app = express();
const ConfigElectronViewer = require("./utils/ConfigElectronViewer");
const ContentSearcher = require("./utils/lunr/ContentSearcher");
const Logger = require("./lib/Logger");
const IndexService = require("./service/IndexService");
const { validate } = new Validator();
let loaderMessage = "Loading ...";
let message = "";

Logger.log().info("Server started");

app
	.use(bodyParser.json())
	.use(express.static(path.join(__dirname, "../static")))
	.use(
		cors({
			origin: [
				ConfigElectronViewer.getHostName() +
					":" +
					ConfigElectronViewer.getServerPort(),
				"http://localhost:8088",
			],
		}),
	);

if (ConfigElectronViewer.isEmbeddedDoc()) {
	const indexService = new IndexService();
	// Create index from the documentation
	indexService.createIndex();
}

const urlSchema = {
	type: "object",
	required: ["url"],
	properties: {
		url: {
			type: "string",
		},
	},
};

function hasQueryParams(url) {
	return url.indexOf("?") !== -1;
}

// POST Request sended by the help viewer to redirect to the clicked link from the popover
app.post("/viewerurl", validate({ body: urlSchema }), (req, res) => {
	const splitUrl = req.body.url.split("/");
	const languageCode = splitUrl[splitUrl.length - 1];
	const viewerUrl = new URL(req.body.url);

	res.setHeader("Content-Type", "application/json");

	if (res.status == 500) {
		Logger.log().error(req, res);
		res.send("Internal Server Error");
	} else if (res.status == 404) {
		const message =
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
});

if (ConfigElectronViewer.isEmbeddedDoc()) {
	// GET Request to find the indexed content from lunr
	app.get("/httpd/api/search", (req, res) => {
		if (hasQueryParams(req.url) == false) {
			message = "Query parameters are missing";
			res.status(400).json({ message });
		}
		const query = req.query.query;
		let matchWholeWord = req.query["match-whole-word"];
		let matchCase = req.query["match-case"];

		matchWholeWord = matchWholeWord == undefined ? false : matchWholeWord != "false";
		matchCase = matchCase == undefined ? false : matchCase != "false";

		const lang = req.query.lang.length == "" ? "en" : req.query.lang;
		const maxResultNumber = parseInt(req.query["max-result-number"]);

		const contentSearcher = new ContentSearcher();
		const getSearchResults = contentSearcher.getSearchResults(
			query,
			lang,
			matchWholeWord,
			matchCase,
			maxResultNumber,
		);

		res.setHeader("Content-Type", "application/json");

		if (res.status === 500) {
			Logger.log().error(req, res);
			res.send("Internal Server Error");
		} else if (res.status === 404) {
			message =
				"Unable to find the requested resource ! You can try another URL.";
			res.status(404).json({ message });
		}

		res.status(200).json(getSearchResults);
	});
}

app.use(({ res }) => {
	loaderMessage = "Chargement ...";
	res.send(loaderMessage);
});

const server = app.listen(ConfigElectronViewer.getServerPort(), () => {
	Logger.log().info(
		`Server listening on port : ${ConfigElectronViewer.getServerPort()}`,
	);
});

module.exports = server;
