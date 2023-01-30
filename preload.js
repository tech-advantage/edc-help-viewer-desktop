const ConfigElectronViewer = require("./src/utils/ConfigElectronViewer");
const UrlUtils = require("./src/utils/UrlUtils");
const PathResolver = require("./src/utils/PathResolver");
const FsUtils = require("./src/utils/FsUtils");

window.addEventListener("DOMContentLoaded", () => {
	const imgViewer = document.querySelector(".img-content img");
	const imgContent = document.querySelector(".img-content");

	if (ConfigElectronViewer.getServerPort() !== null) {
		require("./src/expressServer/server.js");

		if (window.origin === UrlUtils.getUrl()) {
			if (imgContent == null) {
				const esScripts = [
					createEsScript("/help/runtime-es2015.js"),
					createEsScript("/help/polyfills-es2015.js"),
					createEsScript("/help/main-es2015.js"),
				];

				const rootElemBase = document.querySelector("app-root");
				if (!rootElemBase) {
					createBaseTag();
					insertLinkStyleSheet();
					const appRoot = document.createElement("app-root");
					document.body.prepend(appRoot);
				}

				for (const esScript of esScripts) {
					document.body.appendChild(esScript);
				}
			} else {
				imgViewer.src = ConfigElectronViewer.getImgLoader();
			}
		}
	}
});

function createBaseTag() {
	const base = document.createElement("base");
	base.href = "/help/";
	document.getElementsByTagName("head")[0].appendChild(base);
}

function insertLinkStyleSheet() {
	const head = document.getElementsByTagName("head")[0];
	const cssFiles = FsUtils.readDirSync(PathResolver.getCssFiles());
	const urlConfig = `${ConfigElectronViewer.getHostName()}:${ConfigElectronViewer.getServerPort()}`;
	const linkStyleBase = createLinkStyleSheet("styles.css");
	head.appendChild(linkStyleBase);
	for (const file of cssFiles) {
		const linksStyleAssets = createLinkStyleSheet(
			`${urlConfig}/help/assets/style/${file}`,
		);
		head.appendChild(linksStyleAssets);
	}
}

function createLinkStyleSheet(fileName) {
	const link = document.createElement("link");
	link.rel = "stylesheet";
	link.type = "text/css";
	link.href = fileName;
	return link;
}

function createEsScript(fileName) {
	const esScript = document.createElement("script");
	esScript.src = fileName;
	esScript.type = "module";
	esScript.async;
	return esScript;
}
