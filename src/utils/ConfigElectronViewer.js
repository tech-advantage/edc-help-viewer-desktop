const configViewer = require("../../conf/config_electron_viewer.json");

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
		configViewer.docPath = "../../../static/doc";
		if (
			this.isEmpty(configViewer.docPath) &&
			ConfigElectronViewer.isEmbeddedDoc()
		) {
			configViewer.docPath = "../../../static/doc";
		}
		if (process.argv[2] == "test") {
			configViewer.docPath = "../../../test/ressources/doc";
		}
		return configViewer.docPath;
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
