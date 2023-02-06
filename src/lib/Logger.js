const path = require("path");
const log = require("electron-log");
const PathResolver = require("../utils/PathResolver");

module.exports = class Logger {
	static getLogTransportConsole() {
		return (log.transports.console.format =
			"[{d}-{m}-{y} {h}:{i}:{s} .{ms}] > [{level}] {text}");
	}

	// Format logs to the file
	static getLogTransportFile() {
		return (log.transports.file.format =
			"[{d}-{m}-{y} {h}:{i}:{s} .{ms}] > [{level}] {text}");
	}

	// Write the log to the specified file
	static getLogResolvePath() {
		return (log.transports.file.resolvePath = () =>
			path.join(PathResolver.getUserHome(), "/edc_help_viewer/log/main.log"));
	}

	static setupLog() {
		Logger.getLogTransportConsole();
		Logger.getLogTransportFile();
		Logger.getLogResolvePath();
	}

	static log() {
		Logger.setupLog();
		return log;
	}
};
