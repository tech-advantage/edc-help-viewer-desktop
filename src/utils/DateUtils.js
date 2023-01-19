class DateUtils {
	/**
	 * Return the updatedAt date of the doc directory
	 *
	 * @param {*} mtimeMs
	 * @returns date
	 */
	static getUpdatedAtDoc(mtimeMs) {
		var date = new Date(mtimeMs).toISOString();
		return date;
	}
}

module.exports = DateUtils;
