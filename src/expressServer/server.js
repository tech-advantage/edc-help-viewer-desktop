const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs");
const cors = require("cors");
const Logger = require("../lib/Logger");
const ConfigElectronViewer = require("../utils/ConfigElectronViewer");
const ContentSearcher = require("../utils/lunr/ContentSearcher");
const IndexService = require("../service/IndexService");
const DocumentService = require("../service/DocumentService");
const viewerRouter = require("./routes/viewer");
const searchRouter = require("./routes/search");
const UrlUtils = require("../utils/UrlUtils");
const DateUtils = require("../utils/DateUtils");
var docService = new DocumentService().getInstance();
const homedir = require("os").homedir();

Logger.log().info("Server started");

app
	.use(bodyParser.json())
	.use(express.static(path.join(__dirname, "../../static")))
	.use(cors(UrlUtils.handleCors()));

function createIndex() {
	const indexService = new IndexService();
	// Create index from the documentation
	indexService.createIndex();
}

/**
 * Insert the documents to the documents variable
 */
async function initDoc() {
	await docService.getDocCache().then((documents) => {
		ContentSearcher.documents = documents;
	});
}

/**
 * Rewrite Index if doc was changed
 *
 * @param {*} documents
 */
function rewriteIndexWithNewDoc(documents) {
	const docPath = ConfigElectronViewer.getDocPath();
	fs.stat(docPath, function (err, stats) {
		try {
			// Check if the doc directory was changed
			if (
				DateUtils.getUpdatedAtDoc(stats.mtimeMs) !==
					ConfigElectronViewer.getLastUpdatedDoc() ||
				documents == null
			) {
				const configElectronViewerFileData = fs.readFileSync(
					path.join(__dirname, "../../conf/config_electron_viewer.json"),
				);
				var parseContent = JSON.parse(configElectronViewerFileData);
				parseContent.doc_last_updated = DateUtils.getUpdatedAtDoc(
					stats.mtimeMs,
				);
				fs.writeFileSync(
					path.join(__dirname, "../../conf/config_electron_viewer.json"),
					JSON.stringify(parseContent, null, 4),
				);
				// If the documentation directory has changed then we create an index
				createIndex();
			}
		} catch (err) {
			Logger.log().error("The doc directory doesn't exist.");
		}
	});
}
// POST Request sended by the help viewer to redirect to the clicked link from the popover
app.use("/api", viewerRouter);

if (ConfigElectronViewer.isEmbeddedDoc()) {
	initDoc();

	let cacheDocPath = path.join(homedir, "/edc_help_viewer/doc");
	fs.opendir(cacheDocPath, async (err, dir) => {
		await dir
			.read()
			.then((documents) => {
				rewriteIndexWithNewDoc(documents);
			})
			.catch((err) => {
				Logger.log().error(err);
			});
	});

	// GET Request to find search content
	app.use("/httpd/api", searchRouter);
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
