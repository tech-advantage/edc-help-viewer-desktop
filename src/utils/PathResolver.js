const ConfigElectronViewer = require("./ConfigElectronViewer");
const path = require("path");

class PathResolver {
	/**
	 * Return the url constructed
	 *
	 * @returns {string} the url constructed
	 */
	static getUrl() {
		return (
			ConfigElectronViewer.getHostName() +
			":" +
			ConfigElectronViewer.getServerPort()
		);
	}

	/**
	 * Return the home page of viewer
	 *
	 * @returns {string} the home viewer url
	 */
	static getHelpViewerHomePath() {
		return this.getUrl() + "/help/index.html";
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
}
module.exports = PathResolver;
