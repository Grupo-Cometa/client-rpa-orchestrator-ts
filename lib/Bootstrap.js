"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bootstrap = void 0;
const ScheduleAmqp_1 = require("./Amqp/ScheduleAmqp");
const Start_1 = require("./Start");
const WebSocketClient_1 = require("./WebSocket/WebSocketClient");
var execSync = require("child_process").execSync;
const child_process_1 = require("child_process");
class Bootstrap {
    main;
    start;
    constructor(main) {
        this.main = main;
        this.start = new Start_1.Start(main);
    }
    async run() {
        const socketStatus = new WebSocketClient_1.WebSocketClient(`status.${process.env.PUBLIC_ID}`);
        const socketStart = new WebSocketClient_1.WebSocketClient(`start.${process.env.PUBLIC_ID}`);
        const socketStop = new WebSocketClient_1.WebSocketClient(`stop.${process.env.PUBLIC_ID}`);
        const methodStatus = this.main.publishStatus ? this.main.publishStatus : this.publishStatus;
        const methodStop = this.main.stop ? this.main.stop : this.stop;
        setInterval(() => {
            socketStatus.sendMessage(methodStatus());
        }, 3500);
        await ScheduleAmqp_1.ScheduleAmqp.consume();
        socketStart.onMessage(async ({ data }) => {
            await this.start.execute('', data.token);
        });
        socketStop.onMessage(async () => {
            await methodStop();
        });
    }
    publishStatus = () => {
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
    };
    stop = () => {
        const command = "taskkill /F /IM chrome.exe";
        (0, child_process_1.exec)(command);
    };
}
exports.Bootstrap = Bootstrap;
