import { Log } from "../types";
import { WebSocketClient } from "./WebSocketClient";

class LogSocket {
    static send(log: Log) {
        const soket = new WebSocketClient(`logs.${process.env.PUBLIC_ID}`)
        soket.sendMessage(log)
    }
}

export { LogSocket }