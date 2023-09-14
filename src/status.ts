import { WebSocketClient } from "./WebSocket/WebSocketClient";
var execSync = require("child_process").execSync;

const os: any = {
  linux: {
    command: 'ps aux',
    process: 'playwright',
  },
  win32: {
    command: 'wmic process get description',
    process: 'playwright',
  },
}

export default function status() {
  try {

    let uipathRunning = false;
    let currentOs = process.platform
    let command = os[currentOs].command
    let processBot = os[currentOs].process

    const socket = new WebSocketClient(`status.${process.env.PUBLIC_ID}`);

    setInterval(() => {
      var processes = execSync(command).toString();

      uipathRunning = processes.includes(processBot);
      socket.sendMessage({
        inExecution: uipathRunning
      })
    }, 3500)

    return;
  } catch (error) {
    return error
  }
}