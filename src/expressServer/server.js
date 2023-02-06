const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const path = require("path");
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
const PathResolver = require("../utils/PathResolver");
const FsUtils = require("../utils/FsUtils");
var docService = new DocumentService().getInstance();
const Cache = require("file-system-cache").default;
const cache = Cache({
	basePath: PathResolver.getUserHome() + "/edc_help_viewer/doc",
});
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

	FsUtils.getStatsSync(docPath).then((data) => {
		if (
			DateUtils.getUpdatedAtDoc(data.mtimeMs) !==
				ConfigElectronViewer.getLastUpdatedDoc() ||
			documents == null
		) {
			// If the documentation directory has changed we update the last update date and then we create an index
			ConfigElectronViewer.updateLastUpdatedDoc(
				PathResolver.getConfigElectronViewerPath(),
				data.mtimeMs,
			);
			cache.clear();
			// If the documentation directory has changed then we create an index
			createIndex();
		}
	});
}
// POST Request sended by the help viewer to redirect to the clicked link from the popover
app.use("/api", viewerRouter);

if (ConfigElectronViewer.isEmbeddedDoc()) {
	initDoc();

	let cacheDocPath = PathResolver.getDocCachePath();

	FsUtils.openDirSync(cacheDocPath).then(async (dir, err) => {
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
