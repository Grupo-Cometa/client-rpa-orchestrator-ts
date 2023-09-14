import { WebSocketClient } from "./WebSocket/WebSocketClient";
import { InterfaceOs } from "./types/InterfaceOs";
var execSync = require("child_process").execSync;

export class Status 
{
  public static publish() {
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

    const currentOs = process.platform
    const command = os[currentOs].command
    const processBot = os[currentOs].process

    let inExecution = false;
    
    const socket = new WebSocketClient(`status.${process.env.PUBLIC_ID}`);

    setInterval(() => {
      var processes = execSync(command).toString();
      inExecution = processes.includes(processBot);
      socket.sendMessage({
        inExecution
      })
    }, 3500)
  }
}