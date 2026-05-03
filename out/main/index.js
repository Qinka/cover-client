import { createRequire } from "node:module";
import * as fs from "fs";
import * as path from "path";
import { spawn } from "child_process";
// -- CommonJS Shims --
import __cjs_mod__ from "node:module";
import.meta.filename;
const __dirname = import.meta.dirname;
__cjs_mod__.createRequire(import.meta.url);
//#region \0rolldown/runtime.js
var __commonJSMin = (cb, mod) => () => (mod || (cb((mod = { exports: {} }).exports, mod), cb = null), mod.exports);
var __require = /* @__PURE__ */ createRequire(import.meta.url);
//#endregion
//#region electron/main.ts
var import_electron = (/* @__PURE__ */ __commonJSMin(((exports, module) => {
	var fs$1 = __require("fs");
	var path$1 = __require("path");
	var pathFile = path$1.join(__dirname, "path.txt");
	function getElectronPath() {
		let executablePath;
		if (fs$1.existsSync(pathFile)) executablePath = fs$1.readFileSync(pathFile, "utf-8");
		if (process.env.ELECTRON_OVERRIDE_DIST_PATH) return path$1.join(process.env.ELECTRON_OVERRIDE_DIST_PATH, executablePath || "electron");
		if (executablePath) return path$1.join(__dirname, "dist", executablePath);
		else throw new Error("Electron failed to install correctly, please delete node_modules/electron and try installing again");
	}
	module.exports = getElectronPath();
})))();
var mainWindow = null;
function createWindow() {
	mainWindow = new import_electron.BrowserWindow({
		width: 1200,
		height: 800,
		webPreferences: {
			preload: path.join(__dirname, "preload.js"),
			contextIsolation: true,
			nodeIntegration: false
		}
	});
	if (process.env.VITE_DEV_SERVER_URL) {
		mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL);
		mainWindow.webContents.openDevTools();
	} else mainWindow.loadFile(path.join(__dirname, "../dist-renderer/index.html"));
	mainWindow.on("closed", () => {
		mainWindow = null;
	});
}
import_electron.app.whenReady().then(createWindow);
import_electron.app.on("window-all-closed", () => {
	if (process.platform !== "darwin") import_electron.app.quit();
});
import_electron.app.on("activate", () => {
	if (mainWindow === null) createWindow();
});
import_electron.ipcMain.handle("dialog:openFile", async () => {
	const result = await import_electron.dialog.showOpenDialog({
		properties: ["openFile"],
		filters: [{
			name: "ELF Files",
			extensions: ["*"]
		}, {
			name: "All Files",
			extensions: ["*"]
		}]
	});
	if (result.canceled || result.filePaths.length === 0) return null;
	const filePath = result.filePaths[0];
	const buffer = fs.readFileSync(filePath);
	return {
		name: path.basename(filePath),
		path: filePath,
		data: Array.from(buffer)
	};
});
import_electron.ipcMain.handle("dialog:saveFile", async (_event, data, defaultName) => {
	const result = await import_electron.dialog.showSaveDialog({
		defaultPath: defaultName,
		filters: [{
			name: "ELF Files",
			extensions: ["*"]
		}, {
			name: "All Files",
			extensions: ["*"]
		}]
	});
	if (result.canceled || !result.filePath) return { success: false };
	try {
		fs.writeFileSync(result.filePath, Buffer.from(data));
		return {
			success: true,
			path: result.filePath
		};
	} catch (error) {
		return {
			success: false,
			error: error.message
		};
	}
});
import_electron.ipcMain.handle("cli:pack", async (_event, inputData, level) => {
	return new Promise((resolve, reject) => {
		const tmpInput = path.join(import_electron.app.getPath("temp"), `cover-input-${Date.now()}`);
		const tmpOutput = path.join(import_electron.app.getPath("temp"), `cover-output-${Date.now()}`);
		try {
			fs.writeFileSync(tmpInput, Buffer.from(inputData));
			const coverPath = path.join(__dirname, "../../cover/target/release/cover");
			if (!fs.existsSync(coverPath)) {
				reject(/* @__PURE__ */ new Error("cover CLI not found at: " + coverPath));
				return;
			}
			const proc = spawn(coverPath, [
				"pack",
				tmpInput,
				"-o",
				tmpOutput,
				"--level",
				level.toString()
			]);
			let stderr = "";
			proc.stderr.on("data", (data) => {
				stderr += data.toString();
			});
			proc.on("close", (code) => {
				try {
					if (fs.existsSync(tmpInput)) fs.unlinkSync(tmpInput);
					if (code !== 0) {
						reject(/* @__PURE__ */ new Error(`cover CLI failed: ${stderr}`));
						return;
					}
					const output = fs.readFileSync(tmpOutput);
					const result = Array.from(output);
					if (fs.existsSync(tmpOutput)) fs.unlinkSync(tmpOutput);
					resolve(result);
				} catch (error) {
					reject(error);
				}
			});
		} catch (error) {
			reject(error);
		}
	});
});
//#endregion
export {};
