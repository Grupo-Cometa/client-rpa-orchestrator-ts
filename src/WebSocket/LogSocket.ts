import { Log } from "../types";
import { WebSocketClient } from "./WebSocketClient";

class LogSocket {
    static send(log: Log) {
        try {
            const socket = new WebSocketClient(`logs.${process.env.PUBLIC_ID}`)
            socket.sendMessage(log)
        } catch (error: unknown) {
            
        }
    }
}

export { LogSocket }