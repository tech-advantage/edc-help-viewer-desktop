const ConfigElectronViewer = require("./ConfigElectronViewer");

class UrlUtils {
	/**
	 * Return configuration for cors
	 *
	 * @returns cors
	 */
	static handleCors() {
		const corsConfig = {
			origin: [
				ConfigElectronViewer.getHostName() +
					":" +
					ConfigElectronViewer.getServerPort(),
				"http://localhost:8088",
			],
		};
		return corsConfig;
	}

	/**
	 * Check if url has query params
	 *
	 * @param {*} url
	 * @returns boolean
	 */
	static hasQueryParams(url) {
		return url.indexOf("?") !== -1;
	}

	/**
	 * Return host
	 *
	 * @returns {string} the host url
	 */
	static getUrl() {
		return (
			ConfigElectronViewer.getHostName() +
			":" +
			ConfigElectronViewer.getServerPort()
		);
	}

	/**
	 * Create url schema
	 *
	 * @returns urlSchema
	 */
	static urlSchema() {
		const urlSchema = {
			type: "object",
			required: ["url"],
			properties: {
				url: {
					type: "string",
				},
			},
		};
		return urlSchema;
	}
}

module.exports = UrlUtils;
