import { LogAmqp } from './Amqp/LogAmqp';
import { printScreen } from './Utils/printScreen';
import { LogSocket } from './WebSocket/LogSocket';
import { Log as LogType } from "./types"

export class Log {
    static async write(type: LogType["log_type"], message: string) {
        try {
            if (process.env.DEBUG?.toLowerCase() == 'true') {
                return printScreen[type](message)
            }

            const log: LogType = {
                log_type: type,
                message,
                public_id: process.env.PUBLIC_ID,
                type: 'log'
            }

            LogSocket.send(log)
            await LogAmqp.publish(log)
        } catch (error) {
            printScreen[type](message)
        }
    }
}