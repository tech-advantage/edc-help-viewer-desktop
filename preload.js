const ConfigElectronViewer = require("./src/utils/ConfigElectronViewer");
const path = require("path");
const fs = require("fs");
const PathResolver = require("./src/utils/PathResolver");

window.addEventListener("DOMContentLoaded", () => {
	const imgViewer = document.querySelector(".img-content img");
	const imgContent = document.querySelector(".img-content");

	if (ConfigElectronViewer.getServerPort() !== null) {
		require("./src/server.js");
		if (window.origin === PathResolver.getUrl()) {
			if (imgContent == null) {
				const allEsScripts = [
					createEsScript("/help/runtime-es2015.js"),
					createEsScript("/help/polyfills-es2015.js"),
					createEsScript("/help/main-es2015.js"),
				];

				const rootElemBase = document.querySelector("app-root");
				if (!rootElemBase) {
					const base = document.createElement("base");
					base.href = "/help/";
					document.getElementsByTagName("head")[0].appendChild(base);
					const head = document.getElementsByTagName("head")[0];
					const cssFiles = fs.readdirSync(
						path.join(__dirname, "./static/help/assets/style"),
					);
					const urlConfig = `${ConfigElectronViewer.getHostName()}:${ConfigElectronViewer.getServerPort()}`;
					const linkStyleBase = createLinkStyleFile("styles.css");
					head.appendChild(linkStyleBase);
					for (const file of cssFiles) {
						const linksStyleAssets = createLinkStyleFile(
							`${urlConfig}/help/assets/style/${file}`,
						);
						head.appendChild(linksStyleAssets);
					}
					const elem = document.createElement("app-root");
					document.body.prepend(elem);
				}

				for (let i = 0; i < allEsScripts.length; i++) {
					document.body.appendChild(allEsScripts[i]);
				}
			} else {
				imgViewer.src = ConfigElectronViewer.getImgLoader();
			}
		}
	}
});

function createLinkStyleFile(fileName) {
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
