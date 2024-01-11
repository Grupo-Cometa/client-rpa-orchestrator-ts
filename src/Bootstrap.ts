import { platform } from "os";
import { ScheduleAmqp } from "./Amqp/ScheduleAmqp";
import { CrontabScheduleManager } from "./CrontabScheduleManager";
import { InterfaceMain } from "./InterfaceMain";
import { Start } from "./Start";
import { WebSocketClient } from "./WebSocket/WebSocketClient";
import { InterfaceOs } from "./types/InterfaceOs";
var execSync = require("child_process").execSync;
import { exec } from "child_process";

export class Bootstrap {

    private start: Start;

    constructor(private main: InterfaceMain) {
        this.start = new Start(main);
    }

    async run() {
        const socketStatus = new WebSocketClient(`status.${process.env.PUBLIC_ID}`);
        const socketStart = new WebSocketClient(`start.${process.env.PUBLIC_ID}`);
        const socketStop = new WebSocketClient(`stop.${process.env.PUBLIC_ID}`);
        const socketEventEmitCrontab = new WebSocketClient(`event.emit:crontab.${process.env.PUBLIC_ID}`);
        const socketCrontab = new WebSocketClient(`crontab.${process.env.PUBLIC_ID}`)

        const methodStatus = this.main.publishStatus ? this.main.publishStatus : this.publishStatus;
        const methodStop = this.main.stop ? this.main.stop : this.stop;

        setInterval(() => {
            socketStatus.sendMessage(
                methodStatus()
            )
        }, 3500)

        socketStart.onMessage(async ({ data }) => {
            await this.start.execute('', data.token);
        })

        socketStop.onMessage(async () => {
            await methodStop();
        })

        socketEventEmitCrontab.onMessage(() => {
            if (platform() == 'linux') {
                const crontabScheduleManager = new CrontabScheduleManager();
                socketCrontab.sendMessage({
                    crontab: crontabScheduleManager.getCronsText()
                })
            }
        })
        const scheduleAmqp = new ScheduleAmqp
        await scheduleAmqp.consume();
    }

    publishStatus = () => {
        const os: InterfaceOs = {
            'linux': {
                command: 'ps aux',
                process: 'playwright',
            },
            'win32': {
                command: 'wmic process get description',
                process: 'playwright',
            },
        }

        let inExecution = false;
        const currentOs = process.platform
        const command = os[currentOs].command
        const processBot = os[currentOs].process
        var processes = execSync(command).toString();
        inExecution = processes.includes(processBot);

        let cpu = ''
        let ram = ''
        let versionClient = ''

        return {
            inExecution,
            cpu,
            ram,
            versionClient
        }
    }

    stop = () => {
        const command = "taskkill /F /IM chrome.exe"
        exec(command);
    }
}