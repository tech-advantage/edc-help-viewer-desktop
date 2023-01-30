const fs = require("fs");
const admZip = require("adm-zip");
const { ROOT_FOLDER } = require("../conf/edc_const");
const Logger = require("../src/lib/Logger");
const FsUtils = require("../src/utils/FsUtils");

module.exports.unzipViewer = function () {
	// Read the content of a given directory
	let zip_file = FsUtils.readDirSync(ROOT_FOLDER + "/dist/zip");

	// Read the archive
	let zip = new admZip(ROOT_FOLDER + "/dist/zip/" + zip_file);

	Logger.log().info("%c start unzip", "color: green");

	try {
		// Return an array with files and directory from archive
		zipEntries = zip.getEntries();

		// Extracts the entire archive to the given location.
		zip.extractAllTo(ROOT_FOLDER, true);
		Logger.log().info("%c done unzip", "color: green");
	} catch (e) {
		Logger.log().error(e);
	}
};
