const path = require("path");
const UrlUtils = require("./UrlUtils");

class PathResolver {
	/**
	 * Return the home page of viewer
	 *
	 * @returns {string} the home viewer url
	 */
	static getHelpViewerHomePath() {
		return UrlUtils.getUrl() + "/help/index.html";
	}

	/**
	 * Return the preload html file
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
	 * Return css files from help directory
	 *
	 * @returns files
	 */
	static getCssFiles() {
		return path.join(__dirname, "../../static/help/assets/style");
	}
}
module.exports = PathResolver;
