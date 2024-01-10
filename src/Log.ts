import { LogAmqp } from './Amqp/LogAmqp';
import { printScreen } from './Utils/printScreen';
import { LogSocket } from './WebSocket/LogSocket';
import { Log as LogType } from "./types";
import moment from 'moment';
import * as fs from 'fs'
import { tmpdir } from "os"
import path from 'path';

export class Log {
    static async write(type: LogType["log_type"], message: string, writeFileLog = false) {
        try {
            printScreen[type](message)

            await this.logFile(type, message, writeFileLog)

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

    static async logFile(type: LogType["log_type"], message: string, writeFileLog = false) {
        if (!writeFileLog) return;

        const filename = path.join(tmpdir(), 'orquestrador/log.txt')
        if (!fs.existsSync(filename)) fs.writeFileSync(filename, '')

        fs.appendFileSync(filename, `[${new Date}] ${message} [${type}] \n`)
    }

}