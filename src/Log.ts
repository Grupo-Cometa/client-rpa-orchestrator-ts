import { LogAmqp } from './Amqp/LogAmqp';
import { printScreen } from './Utils/printScreen';
import { LogSocket } from './WebSocket/LogSocket';
import { Log as LogType } from "./types";
import moment from 'moment';
import * as fs from 'fs'

export class Log {
    static async write(type: LogType["log_type"], message: string, writeFileLog = false) {
        try {
            printScreen[type](message)

            if (writeFileLog) fs.appendFileSync('/var/log/orquestrado.log', `[${new Date}] ${message} [${type}]`)

            if (process.env.DEBUG?.toLowerCase() == 'false') {
                const log: LogType = {
                    log_type: type,
                    message,
                    public_id: process.env.PUBLIC_ID,
                    type: 'log',
                    date: moment().format('YYYY-MM-DD HH:mm:ss')
                }
                LogSocket.send(log)
                await LogAmqp.publish(log)
            }
        } catch (error) {
            printScreen[type](message)
        }
    }

}