const configViewer = require("../../conf/config_electron_viewer.json");
const path = require("path");
const FsUtils = require("./FsUtils");
const DateUtils = require("./DateUtils");

class ConfigElectronViewer {
	/**
	 * Check the string passed
	 *
	 * @param {*} str
	 * @returns
	 */
	static isEmpty(str) {
		return !str || str.length === 0;
	}

	/**
	 * Return the host name
	 *
	 * @returns {string}
	 */
	static getHostName() {
		if (this.isEmpty(configViewer.hostname)) {
			return "http://localhost";
		}
		return configViewer.hostname;
	}

	/**
	 * Return the server port number
	 *
	 * @returns {number}
	 */
	static getServerPort() {
		if (!configViewer.server_port) {
			return 60000;
		}
		if (typeof configViewer.server_port === "string") {
			return parseInt(configViewer.server_port);
		}

		return configViewer.server_port;
	}

	/**
	 * Return the doc path
	 *
	 * @returns {string}
	 */
	static getDocPath() {
		let docPath = path.join(__dirname, "../../" + configViewer.docPath);
		const mochaPathSplit = process.argv[1].split("\\");
		this.isEmpty(configViewer.docPath) &&
			ConfigElectronViewer.isEmbeddedDoc() &&
			(docPath = path.join(__dirname, "../../static/doc"));

		mochaPathSplit[mochaPathSplit.length - 1] == "mocha.js" &&
			(docPath = path.join(__dirname, "../test/resources/doc"));

		return docPath;
	}

	/**
	 * Update doc last updated field
	 *
	 * @param {*} path
	 * @param {*} key
	 * @param {*} value
	 */
	static updateLastUpdatedDoc(path, mtimeMs) {
		const fileData = FsUtils.readFileSync(path);
		var parseContent = JSON.parse(fileData);
		parseContent["doc_last_updated"] = DateUtils.getUpdatedAtDoc(mtimeMs);
		FsUtils.writeFileSync(path, JSON.stringify(parseContent, null, 4));
	}

	/**
	 * Return the last updated date of doc directory
	 *
	 * @returns {string}
	 */
	static getLastUpdatedDoc() {
		return configViewer.doc_last_updated;
	}

	/**
	 * Return true if enable
	 *
	 * @returns {boolean}
	 */
	static isEmbeddedDoc() {
		return !!configViewer.isEmbeddedDoc;
	}

	/**
	 * Return true if enable
	 *
	 * @returns {boolean}
	 */
	static isEnableMenu() {
		return !!configViewer.browserWindow.isEnableMenu;
	}

	/**
	 * Return the viewer img loader
	 *
	 * @returns {string} the viewer img loader
	 */
	static getImgLoader() {
		return configViewer.img_loader;
	}

	/**
	 * The width of browser window
	 *
	 * @returns browserWindow width
	 */
	static getBrowserWindowWidth() {
		return configViewer.browserWindow.width;
	}

	/**
	 * The height of browser window
	 *
	 * @returns browserWindow height
	 */
	static getBrowserWindowHeight() {
		return configViewer.browserWindow.height;
	}
}

module.exports = ConfigElectronViewer;
