"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bootstrap = void 0;
const os_1 = require("os");
const ScheduleAmqp_1 = require("./Amqp/ScheduleAmqp");
const CrontabScheduleManager_1 = require("./CrontabScheduleManager");
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
    async sleep(ms) {
        return await new Promise(resolve => setTimeout(resolve, ms));
    }
    async run() {
        const socketStatus = new WebSocketClient_1.WebSocketClient(`status.${process.env.PUBLIC_ID}`);
        const socketStart = new WebSocketClient_1.WebSocketClient(`start.${process.env.PUBLIC_ID}`);
        const socketStop = new WebSocketClient_1.WebSocketClient(`stop.${process.env.PUBLIC_ID}`);
        const socketEventEmitCrontab = new WebSocketClient_1.WebSocketClient(`event.emit:crontab.${process.env.PUBLIC_ID}`);
        const socketCrontab = new WebSocketClient_1.WebSocketClient(`crontab.${process.env.PUBLIC_ID}`);
        try {
            const methodStatus = this.main.publishStatus ? this.main.publishStatus : this.publishStatus;
            const methodStop = this.main.stop ? this.main.stop : this.stop;
            setInterval(() => {
                socketStatus.sendMessage(methodStatus());
            }, 3500);
            socketStart.onMessage(async ({ data }) => {
                await this.start.execute('', data.token);
            });
            socketStop.onMessage(async () => {
                await methodStop();
            });
            socketEventEmitCrontab.onMessage(() => {
                if ((0, os_1.platform)() == 'linux') {
                    const crontabScheduleManager = new CrontabScheduleManager_1.CrontabScheduleManager();
                    socketCrontab.sendMessage({
                        crontab: crontabScheduleManager.getCronsText()
                    });
                }
            });
            const scheduleAmqp = new ScheduleAmqp_1.ScheduleAmqp;
            await scheduleAmqp.consume();
        }
        catch (error) {
            socketStatus.close();
            socketStart.close();
            socketStop.close();
            socketEventEmitCrontab.close();
            socketCrontab.close();
            this.sleep(2500);
            this.run();
        }
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
