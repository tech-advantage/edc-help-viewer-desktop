const fs = require("fs");

class FsUtils {
	/**
	 * Synchronously writes data to a file
	 *
	 * @param {*} path
	 * @param {*} data
	 */
	static writeFileSync(path, data) {
		fs.writeFileSync(path, data);
	}

	/**
	 * Return information about the given file or directory
	 *
	 * @param {*} path
	 * @returns stats
	 */
	static async getStatsSync(path) {
		const stats = await fs.statSync(path);
		return stats;
	}

	/**
	 * Return the opened directory synchronously
	 *
	 * @param {*} path
	 * @returns stats
	 */
	static async openDirSync(path) {
		const dir = fs.opendirSync(path);
		return dir;
	}

	/**
	 * Return the entire contents of readed file synchronously
	 *
	 * @param {*} path
	 * @param {*} option
	 * @returns file
	 */
	static readFileSync(path, options) {
		const file = fs.readFileSync(path, options);
		return file;
	}

	/**
	 * Return a directory readed synchronously
	 *
	 * @param {*} path
	 * @returns dir
	 */
	static readDirSync(path, options) {
		const dir = fs.readdirSync(path, options);
		return dir;
	}
}

module.exports = FsUtils;
