import { LogAmqp } from './Amqp/LogAmqp';
import { printScreen } from './Utils/printScreen';
import { LogSocket } from './WebSocket/LogSocket';
import { Log as LogType } from "./types";
import moment from 'moment';
import { readFileSync, existsSync } from "fs";


type Content = Buffer | string | object

export class Log {

    private static currentDateStr() {

        const dataAtual = new Date();
        const formatoDataHora = new Intl.DateTimeFormat('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
        return formatoDataHora.format(dataAtual);
    }
    private static printScreen(typeLog: LogType["log_type"], message: string, content?: Content) {
        if (content) {
            return printScreen[typeLog](`[${this.currentDateStr()}] ${message}`, content, '\n')
        }

        return printScreen[typeLog](`[${this.currentDateStr()}] ${message}`, '\n')
    }
    static async write(typeLog: LogType["log_type"], message: string, content?: Content) {
        try {

            this.printScreen(typeLog, message, content)

            let log: LogType = {
                log_type: typeLog,
                message: message,
                public_id: process.env.PUBLIC_ID,
                type: 'log',
                date: moment().format('YYYY-MM-DD HH:mm:ss'),
            }

            if (content) {
                log["content"] = await this.contentToBase64(content)
            }

            LogSocket.send(log)
            await LogAmqp.publish(log)
        } catch (error) {
            printScreen.error(`erro ao enviar a menssagem via socket:[${message}]`)
            printScreen[typeLog](message)
        }
    }


    static async info(message: string, content?: Content) {
        return await this.write("info", message, content)
    }
    static async error(message: string, content?: Content) {
        return await this.write("error", message, content)
    }
    static async success(message: string, content?: Content) {
        return await this.write("success", message, content)
    }
    static async waring(message: string, content?: Content) {
        return await this.write("warning", message, content)
    }

    private static async contentToBase64(content?: Content) {
        if (!content) return null

        if (content instanceof Buffer) {
            return content.toString('base64')
        }

        if (typeof content == "object") {
            return btoa(JSON.stringify(content))
        }

        const isFile = existsSync(content)
        if (isFile) {
            const file = readFileSync(content)
            return file.toString('base64')
        }

        return btoa(content)
    }
}
