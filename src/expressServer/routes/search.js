const express = require("express");
const LangUtils = require("../../utils/LangUtils");
const ContentSearcher = require("../../utils/lunr/ContentSearcher");
const UrlUtils = require("../../utils/UrlUtils");
const searchRouter = express.Router();

searchRouter.get("/search", (req, res) => {
	if (UrlUtils.hasQueryParams(req.url) == false) {
		message = "Query parameters are missing";
		res.status(400).json({ message });
	}
	const query = req.query.query;
	let matchWholeWord = req.query["match-whole-word"];
	let matchCase = req.query["match-case"];

	matchWholeWord =
		matchWholeWord == undefined ? false : matchWholeWord != "false";
	matchCase = matchCase == undefined ? false : matchCase != "false";

	const lang =
		req.query.lang.length == 0
			? LangUtils.getDefaultLanguage()
			: req.query.lang;

	const maxResultNumber = parseInt(req.query["max-result-number"]);

	const contentSearcher = new ContentSearcher();
	const getSearchResults = contentSearcher.getSearchResults(
		query,
		lang,
		matchWholeWord,
		matchCase,
		maxResultNumber,
	);

	res.setHeader("Content-Type", "application/json");
	if (res.status === 500) {
		Logger.log().error(req, res);
		res.send("Internal Server Error");
	} else if (res.status === 404) {
		message =
			"Unable to find the requested resource ! You can try another URL.";
		res.status(404).json({ message });
	}

	res.status(200).json(getSearchResults);
});

module.exports = searchRouter;
