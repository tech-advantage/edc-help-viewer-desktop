const ConfigElectronViewer = require("./ConfigElectronViewer");
const FsUtils = require("./FsUtils");

class HtmlFormatter {
	/**
	 * Return content between body tags
	 *
	 * @param {*} topic
	 * @returns
	 */
	static getBodyHtmlContent(topic) {
		const dataFile = FsUtils.readFileSync(
			ConfigElectronViewer.getDocPath() + "\\" + topic.url,
			{ encoding: "utf8", flag: "r" },
		);
		const splitAboveBody = dataFile
			.split("<body>")
			.pop()
			.replace(/(\r\n|\n|\r|\t|&nbsp;|&#39;|\s+)/gm, " ");
		const bodyContent = splitAboveBody.split("</body>").shift();

		return bodyContent.trim();
	}

	/**
	 * Remove all html tags
	 *
	 * @param {*} str
	 * @returns
	 */
	static removeTags(str) {
		if (str === null || str === "") {
			return false;
		} else {
			str = str.toString();
		}

		return str.replace(/(<([^>]+)>)/gi, "").trim();
	}

	/**
	 * Format the str to be insert in regex
	 *
	 * @param {*} str
	 * @returns str
	 */
	static formatRegex(str) {
		return "(" + str + ")";
	}
}
module.exports = HtmlFormatter;
