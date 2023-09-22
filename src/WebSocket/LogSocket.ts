import { Log } from "../types";
import { WebSocketClient } from "./WebSocketClient";

class LogSocket {
    static send(log: Log) {
        const socket = new WebSocketClient(`logs.${process.env.PUBLIC_ID}`)
        socket.sendMessage(log)
    }
}

export { LogSocket }