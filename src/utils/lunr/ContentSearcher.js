const homedir = require("os").homedir();
const path = require("path");
const fs = require("fs");
const elasticlunr = require("elasticlunr");
const ContentIndexer = require("./ContentIndexer");
const Logger = require("../../lib/Logger");
const ConfigElectronViewer = require("../ConfigElectronViewer");

class ContentSearcher {
	static homePath = path.join(homedir, "/edc_help_viewer/index/lunr.json");

	/**
	 * Return the defaultLanguage from info.json
	 *
	 * @returns defaultLanguage
	 */
	getDefautlLangugage() {
		const infoFile = require(path.join(
			__dirname,
			ConfigElectronViewer.getDocPath() +
				"/" +
				ContentIndexer.multiDocItems[0].pluginId +
				"/info.json",
		));
		Logger.log().debug("Default language: " + infoFile.defaultLanguage);
		return infoFile.defaultLanguage;
	}

	/**
	 * Returns found documents by the search
	 *
	 * @param {*} query
	 * @param {*} languageCode
	 * @param {*} matchWholeWord
	 * @param {*} matchCase
	 * @param {*} maxResultNumber
	 * @returns document(s)
	 */
	getSearchResults(
		query,
		languageCode,
		matchWholeWord,
		matchCase,
		maxResultNumber,
	) {
		const idxLunr = fs.readFileSync(ContentSearcher.homePath, {
			encoding: "utf8",
			flag: "r",
		});
		const data = JSON.parse(idxLunr);
		const idx = elasticlunr.Index.load(data);

		let result;
		let expand = false;
		let counter = 0;

		const boosts = {
			label: { boosts: 2 },
			content: { boosts: 1 },
			type: { boosts: 0.5 },
		};

		!matchWholeWord ? (expand = true) : (expand = false);

		Logger.log().debug(
			"Query parameters: Query=[" +
				query +
				"], lang=[" +
				languageCode +
				"], matchWholeWord=[" +
				matchWholeWord +
				"], matchCase=[" +
				matchCase +
				"], maxResultNumber=[" +
				maxResultNumber +
				"]",
		);

		const searchContent = idx
			.search(query, { fields: boosts, bool: "AND", expand })
			.flatMap((hit) => {
				let regex;

				if (hit.ref === "undefined") return [];
				const pageMatch = ContentIndexer.documents.filter(
					(page) => page.id === hit.ref,
				);

				counter = counter += 1;

				if (counter <= maxResultNumber) {
					if (languageCode && languageCode !== undefined) {
						result = pageMatch.filter(
							(page) => page.languageCode == languageCode,
						);
					} else {
						result = pageMatch.filter(
							(page) =>
								page.languageCode ==
								(this.getDefautlLangugage() !== undefined
									? this.getDefautlLangugage()
									: "en"),
						);
					}

					matchCase &&
						(regex = this.handleMultipleWordQuery(query, matchWholeWord));
					matchWholeWord &&
						matchCase &&
						(regex = this.handleMultipleWordQuery(query, matchWholeWord));

					if (result[0].content.match(regex) || result[0].label.match(regex)) {
						return result;
					}
				}
				return [];
			});
		Logger.log().debug(
			"Found " + searchContent.length + " results for the search " + query,
		);

		return searchContent;
	}

	/**
	 * Formating the regex with query containing mutliples word
	 *
	 * @param {*} query
	 * @param {*} exactMatch
	 * @returns regex
	 */
	handleMultipleWordQuery(query, exactMatch) {
		let splitQuery;
		let regex;
		const regMatch = exactMatch == true ? "(\\b)" : "";
		const flag = "g";

		if (this.hasWhitespace(query)) {
			splitQuery = query.split(" ");
			for (const value of splitQuery) {
				if (value !== "") {
					regex = new RegExp(
						regMatch + this.formatQueryReg(value) + regMatch,
						flag,
					);
				}
			}
		} else {
			regex = new RegExp(
				regMatch + this.formatQueryReg(query) + regMatch,
				flag,
			);
		}
		return regex;
	}

	/**
	 * Format the query to be insert in regex
	 *
	 * @param {*} query
	 * @returns format query
	 */
	formatQueryReg(query) {
		return "(" + query + ")";
	}

	/**
	 * Check if str contain white space
	 *
	 * @param {*} str
	 * @returns boolean
	 */
	hasWhitespace(str) {
		return /\s/.test(str);
	}
}
module.exports = ContentSearcher;