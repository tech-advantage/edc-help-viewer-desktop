const homedir = require("os").homedir();
const path = require("path");
const Logger = require("../../lib/Logger");
const IndexService = require("../../service/IndexService");
const HtmlFormatter = require("../HtmlFormatter");
const LangUtils = require("../LangUtils");

class ContentSearcher {
	static homePath = path.join(homedir, "/edc_help_viewer/index/lunr.json");
	static documents = [];

	/**
	 * Return query options
	 *
	 * @param {*} query
	 * @param {*} matchWholeWord
	 * @param {*} matchCase
	 * @returns options
	 */
	getSearchOptions(query, matchWholeWord, matchCase) {
		let options = { query };
		if (!matchWholeWord) {
			options.query += "*";
		}
		if (!matchCase) {
			options.query = options.query.toLowerCase();
		}
		return options.query;
	}

	/**
	 * Remove characters who's allow to handle mutliple words required in request
	 *
	 * @param {*} query
	 * @returns query
	 */
	handleRequiredWordsQuery(query) {
		const requiredWords = query.split(" ");
		const res = [];

		if (requiredWords.length > 1) {
			for (const split of requiredWords) {
				res.push(`+${split}`);
			}
			query = res.join(" ");
		} else {
			query = query;
		}
		return query;
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
		const idx = IndexService.getIndex();
		let counter = 0;

		languageCode =
			languageCode.length == 0 ? LangUtils.getDefaultLanguage() : languageCode;
		query = this.getSearchOptions(query, matchWholeWord, matchCase);

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

		query = this.handleRequiredWordsQuery(query);

		const searchContent = idx.search(query).flatMap((hit) => {
			let pageMatch = [];
			if (hit.ref === "undefined") return [];

			!matchWholeWord ? (query = query.replace("*", "")) : query;
			const keyMetaData = Object.keys(hit.matchData.metadata);

			for (const key of keyMetaData) {
				const originalTokenKeys =
					hit.matchData.metadata[key].content.originalToken;
				const languageCodeKeys =
					hit.matchData.metadata[key].languageCode.languageCode;

				if (languageCodeKeys.indexOf(languageCode) == -1) return [];
				if (matchCase) {
					const reg = this.handleWordsMatchQuery(query, matchWholeWord);
					pageMatch = this.caseSensitiveFilter(
						pageMatch,
						originalTokenKeys,
						reg,
						hit,
					);
				} else {
					pageMatch = this.filterByRef(pageMatch, hit.ref);
				}
			}

			counter = counter += 1;

			if (counter <= maxResultNumber) {
				pageMatch = this.filterByLanguageCode(pageMatch, languageCode);
				return pageMatch;
			}
			return [];
		});

		Logger.log().debug(
			"Found " + searchContent.length + " results for the search " + query,
		);
		return searchContent;
	}

	/**
	 * Filter pages by case sensitive
	 *
	 * @param {*} pageMatch
	 * @param {*} originalTokenKeys
	 * @param {*} reg
	 * @param {*} hit
	 * @returns pageMatch
	 */
	caseSensitiveFilter(pageMatch, originalTokenKeys, reg, hit) {
		for (const tokenKey of originalTokenKeys) {
			if (tokenKey.match(reg)) {
				pageMatch = this.filterByRef(pageMatch, hit.ref);
			}
		}
		return pageMatch;
	}

	/**
	 * Filter pages by ref
	 *
	 * @param {*} pageMatch
	 * @param {*} ref
	 * @returns pageMatch
	 */
	filterByRef(pageMatch, ref) {
		pageMatch = ContentSearcher.documents.filter((page) => page.id === ref);
		return pageMatch;
	}

	/**
	 * Filter pages by languageCode
	 *
	 * @param {*} pageMatch
	 * @param {*} languageCode
	 * @returns pageMatch
	 */
	filterByLanguageCode(pageMatch, languageCode) {
		if (languageCode !== "" && languageCode !== false)
			pageMatch = pageMatch.filter(
				(page) => page.languageCode === languageCode,
			);
		return pageMatch;
	}

	/**
	 * Formating the regex with query containing mutliples word
	 *
	 * @param {*} query
	 * @param {*} exactMatch
	 * @returns regex
	 */
	handleWordsMatchQuery(query, exactMatch) {
		let regex;
		const exactMatchPattern = exactMatch == true ? "(\\b)" : "";
		const flag = "g";
		query = query.replace(/\+/g, " ");

		if (this.hasWhitespace(query)) {
			const splitQuery = query.split(" ");
			for (const value of splitQuery) {
				if (value !== "") {
					regex = new RegExp(
						exactMatchPattern +
							HtmlFormatter.formatRegex(value) +
							exactMatchPattern,
						flag,
					);
				}
			}
		} else {
			regex = new RegExp(
				exactMatchPattern +
					HtmlFormatter.formatRegex(query) +
					exactMatchPattern,
				flag,
			);
		}
		return regex;
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
