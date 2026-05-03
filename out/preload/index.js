import { createRequire } from "node:module";
// -- CommonJS Shims --
import __cjs_mod__ from "node:module";
import.meta.filename;
const __dirname = import.meta.dirname;
__cjs_mod__.createRequire(import.meta.url);
//#region \0rolldown/runtime.js
var __commonJSMin = (cb, mod) => () => (mod || (cb((mod = { exports: {} }).exports, mod), cb = null), mod.exports);
var __require = /* @__PURE__ */ createRequire(import.meta.url);
//#endregion
//#region electron/preload.ts
var import_electron = (/* @__PURE__ */ __commonJSMin(((exports, module) => {
	var fs = __require("fs");
	var path = __require("path");
	var pathFile = path.join(__dirname, "path.txt");
	function getElectronPath() {
		let executablePath;
		if (fs.existsSync(pathFile)) executablePath = fs.readFileSync(pathFile, "utf-8");
		if (process.env.ELECTRON_OVERRIDE_DIST_PATH) return path.join(process.env.ELECTRON_OVERRIDE_DIST_PATH, executablePath || "electron");
		if (executablePath) return path.join(__dirname, "dist", executablePath);
		else throw new Error("Electron failed to install correctly, please delete node_modules/electron and try installing again");
	}
	module.exports = getElectronPath();
})))();
import_electron.contextBridge.exposeInMainWorld("electronAPI", {
	openFile: () => import_electron.ipcRenderer.invoke("dialog:openFile"),
	saveFile: (data, defaultName) => import_electron.ipcRenderer.invoke("dialog:saveFile", data, defaultName),
	packWithCLI: (inputData, level) => import_electron.ipcRenderer.invoke("cli:pack", inputData, level)
});
//#endregion
export {};
