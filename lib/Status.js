"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Status = void 0;
const WebSocketClient_1 = require("./WebSocket/WebSocketClient");
var execSync = require("child_process").execSync;
class Status {
    static publish() {
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
        const currentOs = process.platform;
        const command = os[currentOs].command;
        const processBot = os[currentOs].process;
        let inExecution = false;
        const socket = new WebSocketClient_1.WebSocketClient(`status.${process.env.PUBLIC_ID}`);
        setInterval(() => {
            var processes = execSync(command).toString();
            inExecution = processes.includes(processBot);
            socket.sendMessage({
                inExecution
            });
        }, 3500);
    }
}
exports.Status = Status;
