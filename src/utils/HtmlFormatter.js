const fs = require("fs");
const path = require("path");

class HtmlFormatter {
	/**
	 * Return content between body tags
	 *
	 * @param {*} topic
	 * @returns
	 */
	static splitHtml(topic) {
		const docPath =
			process.argv[2] == "test"
				? "..\\..\\test\\ressources\\doc"
				: "\\..\\..\\static\\doc";
		const dataFile = fs.readFileSync(
			path.join(__dirname, docPath + "\\" + topic.url),
			{ encoding: "utf8", flag: "r" },
		);
		const splitAboveBody = dataFile
			.split("<body>")
			.pop()
			.replace(/(\r\n|\n|\r|\t|&nbsp;|&#39;|\s+)/gm, " ");
		const bodyContent = splitAboveBody.split("</body>").shift();

		return bodyContent;
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

		return str.replace(/(<([^>]+)>)/gi, "");
	}
}
module.exports = HtmlFormatter;
