const lunr = require("lunr");
const htmlFormatter = require("../HtmlFormatter");
const Logger = require("../../lib/Logger");
const PathResolver = require("../PathResolver");
const ConfigElectronViewer = require("../ConfigElectronViewer");
const DocumentService = require("../../service/DocumentService");
const LangUtils = require("../LangUtils");
const FsUtils = require("../FsUtils");
var docService = new DocumentService().getInstance();

class ContentIndexer {
	static multiDocItems = [];

	/**
	 * Return multidoc content
	 *
	 * @returns {string}
	 */
	getMultiDocContent() {
		const multidoc = require(ConfigElectronViewer.getDocPath() +
			"/multi-doc.json");

		for (const doc of multidoc) {
			const docElement = {};
			docElement.productId = doc.productId;
			docElement.pluginId = doc.pluginId;
			ContentIndexer.multiDocItems.push(docElement);
			Logger.log().debug(
				"Product ID = " +
					docElement.productId +
					", Plugin ID = " +
					docElement.pluginId +
					";",
			);
		}
		return ContentIndexer.multiDocItems;
	}

	/**
	 * Set toc reference
	 */
	tocIndexer() {
		const productsDirPath = [];
		const productsData = [];

		for (const multidoc of this.getMultiDocContent()) {
			productsDirPath.push(
				ConfigElectronViewer.getDocPath() + "/" + multidoc.pluginId,
			);
		}
		for (const productDirPath of productsDirPath) {
			const productItemObject = {};
			productItemObject.productDirPath = productDirPath;
			try {
				productItemObject.item = require(productDirPath + "/toc.json");
			} catch (e) {
				Logger.log().error("Toc files for the given product not found", e);
			}
			productsData.push(productItemObject);
		}
		for (const product of productsData) {
			if (product.item !== undefined) {
				for (const toc of product.item.toc) {
					this.indexTocReference(product.productDirPath, toc);
				}
			}
		}
	}

	/**
	 * Get the nested content of topics nodes
	 *
	 * @param {*} contents
	 * @param {*} existingChildren
	 * @param {*} strategyId
	 * @param {*} strategyLabel
	 * @param {*} languageCode
	 * @returns topics content
	 */
	static getContentOfTopicsNodes(
		contents,
		existingChildren,
		strategyId,
		strategyLabel,
		languageCode,
	) {
		contents.forEach((toc) => {
			const topicObject = {
				id: toc.id,
				label: toc.label,
				url: toc.url,
				strategyId,
				strategyLabel,
				type: toc.type,
				languageCode,
				content: htmlFormatter.removeTags(
					htmlFormatter.getBodyHtmlContent(toc),
				),
			};

			Logger.log().debug(
				"Help document to index: id: " +
					topicObject.id +
					", label: " +
					topicObject.label +
					", url: " +
					topicObject.url +
					", type: " +
					topicObject.type +
					", languageCode: " +
					topicObject.languageCode +
					"",
			);

			// Adding indexed doc to the service
			docService.setDoc(topicObject);

			existingChildren.push(toc.topics);
			toc.topics &&
				ContentIndexer.getContentOfTopicsNodes(
					toc.topics,
					existingChildren,
					strategyId,
					strategyLabel,
					languageCode,
				);
		});

		return existingChildren;
	}

	/**
	 * Set the content of topics nodes
	 *
	 * @param {*} productDir
	 * @param {*} tocReference
	 */
	indexTocReference(productDir, tocReference) {
		const tocXjsonFile = productDir + "\\" + tocReference.file;

		if (tocXjsonFile) {
			let languageCode;
			const tocJsonFile = require(tocXjsonFile);
			const strategyId = tocJsonFile.id;
			let strategyLabel = null;
			let fieldValue = null;

			Object.keys(tocJsonFile).forEach(function (key) {
				if (key !== "id") {
					languageCode = key;
					fieldValue = tocJsonFile[key];
					strategyLabel = fieldValue.label;
					ContentIndexer.getContentOfTopicsNodes(
						fieldValue.topics,
						[],
						strategyId,
						strategyLabel,
						languageCode,
					);
				}
			});
		}
	}

	static tokenize(str) {
		return str.split("");
	}

	/**
	 * Create and write the lunr index
	 */
	indexWriter() {
		this.tocIndexer();
		let docObject = {
			content: "",
			languageCode: "",
		};
		var caseSensitiveTokenizer = function (obj) {
			var str = obj.toString();
			var tokens = [];

			if (LangUtils.getInfoLanguages().indexOf(str) !== -1) {
				docObject.languageCode = str;
			} else {
				docObject.content = str;
			}

			for (let word of docObject.content.split(/\s+/)) {
				word = word.replace(/[.,\/#!$%\^&\*;:{}=\\_`~()]/g, "");

				tokens.push(
					new lunr.Token(word.toLowerCase(), {
						index: tokens.length,
						originalToken: word.replace(/[!.]/gi, ""),
						languageCode: docObject.languageCode,
					}),
				);
			}
			return tokens;
		};

		const pagesIndex = docService.getDocs();

		docService.setDocCache(pagesIndex);

		const lunrIndex = lunr(function () {
			this.tokenizer = caseSensitiveTokenizer;

			this.use(addOriginalTokenMetadata);
			this.use(addLanguageCodeMetadata);

			this.field("content");
			this.field("languageCode");
			this.ref("id");

			this.pipeline.remove(lunr.stopWordFilter);
			this.pipeline.remove(lunr.stemmer);
			this.pipeline.remove(lunr.trimmer);
			this.searchPipeline.remove(lunr.stemmer);
			this.searchPipeline.remove(lunr.trimmer);

			pagesIndex.forEach(function (doc) {
				this.add(doc);
			}, this);
		});

		function addOriginalTokenMetadata(builder) {
			builder.metadataWhitelist.push("originalToken");
		}

		function addLanguageCodeMetadata(builder) {
			builder.metadataWhitelist.push("languageCode");
		}

		const indexedContent = JSON.stringify(lunrIndex, null, 4);

		FsUtils.writeFileSync(
			PathResolver.getUserHome() + "/edc_help_viewer/index/lunr.json",
			indexedContent,
		);
	}
}
module.exports = ContentIndexer;
