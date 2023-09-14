import { InterfaceMain } from "./InterfaceMain";
import { Status } from "./types";
import { InterfaceOs } from "./types/InterfaceOs";
var execSync = require("child_process").execSync;
import { exec } from "child_process";

export abstract class Main implements InterfaceMain {

    publishStatus(): Status {

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

    async stop(): Promise<void> {
        const command = "taskkill /F /IM chrome.exe"
        exec(command);
    }

    abstract start(): Promise<void>;
}