const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const Logger = require("./src/lib/Logger.js");
const ConfigElectronViewer = require("./src/utils/ConfigElectronViewer.js");
const rootPath = require("electron-root-path").rootPath;
require("./src/menu.js");

const PathResolver = require("./src/utils/PathResolver");

function createWindow() {
	// Create main window
	const mainWindow = new BrowserWindow({
		width: ConfigElectronViewer.getBrowserWindowWidth(),
		height: ConfigElectronViewer.getBrowserWindowHeight(),
		icon: getAppIcon(),
		webPreferences: {
			nodeIntegration: false,
			contextIsolation: true,
			preload: path.join(__dirname, "./preload.js"),
		},
		show: false,
	});

	handleHeaders(mainWindow);

	mainWindow.webContents.openDevTools();

	mainWindow
		.loadURL(`${PathResolver.getStaticFileLoaderPath()}`)
		.then(() => {
			Logger.log().info("index.html was loaded successfully");
			mainWindow
				.loadURL(`${PathResolver.getHelpViewerHomePath()}`)
				.then(() => {
					Logger.log().info("Home page viewer was loaded successfully");
				})
				.catch((err) => Logger.log().error(err));
		})
		.catch((err) => Logger.log().error(err));

	redirectFromPostRequest(mainWindow);

	mainWindow.webContents.on("new-window", function (e, url) {
		e.preventDefault();
		require("electron").shell.openExternal(url);
	});
}

function handleHeaders(win) {
	win.webContents.session.webRequest.onBeforeSendHeaders(
		(details, callback) => {
			callback({ requestHeaders: { Origin: "*", ...details.requestHeaders } });
		},
	);
	win.webContents.session.webRequest.onHeadersReceived((details, callback) => {
		callback({
			responseHeaders: {
				"Access-Control-Allow-Origin": [
					ConfigElectronViewer.getHostName() +
						":" +
						ConfigElectronViewer.getServerPort(),
				],
				// We use this to bypass headers
				"Access-Control-Allow-Headers": [
					ConfigElectronViewer.getHostName() +
						":" +
						ConfigElectronViewer.getServerPort(),
				],
				...details.responseHeaders,
			},
		});
	});
}

function redirectFromPostRequest(win) {
	// Receive request from server
	ipcMain.on("requested-url", (e, url) => {
		win.loadURL(url);
		win.show();
		// If unknown URL, redirect to viewer homepage
		win.webContents.on("did-fail-load", function () {
			Logger.log().error("Failed to load URL: " + url);
			win
				.loadURL(`${PathResolver.getHelpViewerHomePath()}`)
				.then(() => {
					Logger.log().info("Home page viewer was loaded successfully");
				})
				.catch((err) => Logger.log().error(err));
		});
	});
}

function getAppIcon() {
	switch (process.platform) {
		case "win32":
			return path.join(
				rootPath,
				"static",
				"assets",
				"building",
				"win32",
				"favicon.ico",
			);
		case "linux":
			return path.join(
				rootPath,
				"static",
				"assets",
				"building",
				"linux",
				"favicon.png",
			);
		case "darwin":
			return path.join(
				rootPath,
				"static",
				"assets",
				"building",
				"darwin",
				"favicon.png",
			);
	}
}

app.whenReady().then(() => {
	// When the app is ready, run the mainWindow
	createWindow();

	app.on("activate", () => {
		if (BrowserWindow.getAllWindows().length === 0) createWindow();
	});
});

// Managing the closing of all windows
app.on("window-all-closed", () => {
	if (process.platform !== "darwin") app.quit();
});
