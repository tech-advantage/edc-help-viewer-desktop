const path = require("path");
const fs = require("fs");
const elasticlunr = require("elasticlunr");
const htmlFormatter = require("../HtmlFormatter");
const Logger = require("../../lib/Logger");
const PathResolver = require("../PathResolver");
const ConfigElectronViewer = require("../ConfigElectronViewer");

class ContentIndexer {
	static multiDocItems = [];
	static documents = [];

	/**
	 * Return multidoc content
	 *
	 * @returns {string}
	 */
	getMultiDocContent() {
		const multidoc = require(path.join(
			__dirname,
			ConfigElectronViewer.getDocPath() + "/multi-doc.json",
		));

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
				path.join(
					__dirname,
					ConfigElectronViewer.getDocPath() + "/" + multidoc.pluginId,
				),
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
				content: htmlFormatter.removeTags(htmlFormatter.splitHtml(toc)).trim(),
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
					"",
			);
			ContentIndexer.documents.push(topicObject);
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

	/**
	 * Create and write the index with elasticlunr
	 */
	indexWriter() {
		this.tocIndexer();

		const pagesIndex = ContentIndexer.documents;
		const lunrIndex = elasticlunr(function () {
			this.pipeline.remove(elasticlunr.stopWordFilter);
			this.pipeline.remove(elasticlunr.stemmer);

			this.addField("label");
			this.addField("type");
			this.addField("content");
			this.setRef("id");

			pagesIndex.forEach(function (doc) {
				this.addDoc(doc);
			}, this);
		});

		const indexedContent = JSON.stringify(lunrIndex, null, 4);
		fs.writeFileSync(
			PathResolver.getUserHome() + "/edc_help_viewer/index/lunr.json",
			indexedContent,
		);
	}
}
module.exports = ContentIndexer;
