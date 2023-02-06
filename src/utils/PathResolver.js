const path = require("path");
const homedir = require("os").homedir();
const UrlUtils = require("./UrlUtils");

class PathResolver {
	/**
	 * Return the home page path of viewer
	 *
	 * @returns {string} home viewer path
	 */
	static getHelpViewerHomePath() {
		return UrlUtils.getUrl() + "/help/index.html";
	}

	/**
	 * Return the preload html file path
	 *
	 * @returns {string} the static index.html
	 */
	static getStaticFileLoaderPath() {
		return `file://${path.join(__dirname, "../../", "public/index.html")}`;
	}

	/**
	 * Return the viewer config path
	 *
	 * @returns {string} the static viewer config path
	 */
	static getStaticViewerConfigPath() {
		return path.join(__dirname, "../../", "static/help/assets/config.json");
	}

	/**
	 * Return the home path
	 *
	 * @returns the home path
	 */
	static getUserHome() {
		return process.env[process.platform === "win32" ? "USERPROFILE" : "HOME"];
	}

	/**
	 * Return css files path from help directory
	 *
	 * @returns css path
	 */
	static getCssFiles() {
		return path.join(__dirname, "../../static/help/assets/style");
	}

	/**
	 * Return configElectronViewer file path
	 *
	 * @returns configElectronViewer path
	 */
	static getConfigElectronViewerPath() {
		return path.join(__dirname, "../../conf/config_electron_viewer.json");
	}

	/**
	 * Return doc cache path
	 *
	 * @returns doc cache path
	 */
	static getDocCachePath() {
		return path.join(homedir, "/edc_help_viewer/doc");
	}

	/**
	 * Return the lunr index path
	 *
	 * @returns lunr index
	 */
	static getLunrIndex() {
		return path.join(homedir, "/edc_help_viewer/index/lunr.json");
	}
}
module.exports = PathResolver;
