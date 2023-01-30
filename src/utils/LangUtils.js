const Logger = require("../lib/Logger");
const ConfigElectronViewer = require("./ConfigElectronViewer");
const FsUtils = require("./FsUtils");

class LangUtils {
	/**
	 * Return products name
	 *
	 * @returns products
	 */
	static getProducts() {
		let products = [];

		const getDirectories = (source) =>
			FsUtils.readDirSync(source, { withFileTypes: true })
				.filter((dirent) => dirent.isDirectory())
				.map((dirent) => dirent.name);

		let docFolders = getDirectories(ConfigElectronViewer.getDocPath());

		for (const docFolder of docFolders) {
			if (docFolder !== "i18n") {
				products.push(docFolder);
			}
		}
		return products;
	}

	/**
	 * Return the content of info.json file
	 *
	 * @param {*} products
	 * @returns infoFile
	 */
	static readInfoFile(products) {
		const infoFile = require(ConfigElectronViewer.getDocPath() +
			"/" +
			products[0] +
			"/info.json");
		return infoFile;
	}

	/**
	 * Return languages from info.json file
	 *
	 * @returns languages
	 */
	static getDefaultLanguage() {
		let products = LangUtils.getProducts();
		if (products.length) {
			let defaultLanguage = LangUtils.readInfoFile(products).defaultLanguage;

			defaultLanguage == undefined ? (defaultLanguage = "en") : defaultLanguage;

			Logger.log().debug("Default language: " + defaultLanguage);

			return defaultLanguage;
		}
	}

	/**
	 * Return the languages from info.json
	 *
	 * @returns languages
	 */
	static getInfoLanguages() {
		let products = LangUtils.getProducts();
		if (products.length) {
			let languages = LangUtils.readInfoFile(products).languages;

			languages == undefined
				? (languages = [LangUtils.getDefaultLanguage()])
				: languages;

			return languages;
		}
	}
}

module.exports = LangUtils;
