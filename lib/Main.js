"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Main = void 0;
var execSync = require("child_process").execSync;
const child_process_1 = require("child_process");
class Main {
    publishStatus() {
        const os = {
            'linux': {
                command: 'ps aux',
                process: 'playwright',
            },
            'win32': {
                command: 'wmic process get description',
                process: 'playwright',
            },
        };
        let inExecution = false;
        const currentOs = process.platform;
        const command = os[currentOs].command;
        const processBot = os[currentOs].process;
        var processes = execSync(command).toString();
        inExecution = processes.includes(processBot);
        let cpu = '';
        let ram = '';
        let versionClient = '';
        return {
            inExecution,
            cpu,
            ram,
            versionClient
        };
    }
    async stop() {
        const command = "taskkill /F /IM chrome.exe";
        (0, child_process_1.exec)(command);
    }
}
exports.Main = Main;
