"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Log = void 0;
const LogAmqp_1 = require("./Amqp/LogAmqp");
const printScreen_1 = require("./Utils/printScreen");
const LogSocket_1 = require("./WebSocket/LogSocket");
const moment_1 = __importDefault(require("moment"));
const fs_1 = require("fs");
class Log {
    static currentDateStr() {
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
    static printScreen(typeLog, message, content) {
        if (content) {
            return printScreen_1.printScreen[typeLog](`[${this.currentDateStr()}] ${message}`, typeof content, '\n');
        }
        return printScreen_1.printScreen[typeLog](`[${this.currentDateStr()}] ${message}`, '\n');
    }
    static async write(typeLog, message, content) {
        try {
            this.printScreen(typeLog, message, content);
            let log = {
                log_type: typeLog,
                message: message,
                public_id: process.env.PUBLIC_ID,
                type: 'log',
                date: (0, moment_1.default)().format('YYYY-MM-DD HH:mm:ss'),
            };
            if (content) {
                log["content"] = await this.contentToBase64(content);
            }
            LogSocket_1.LogSocket.send(log);
            await LogAmqp_1.LogAmqp.publish(log);
        }
        catch (error) {
            printScreen_1.printScreen.error(`erro ao enviar a menssagem via socket:[${message}]`);
            printScreen_1.printScreen[typeLog](message);
        }
    }
    static async info(message, content) {
        return await this.write("info", message, content);
    }
    static async error(message, content) {
        return await this.write("error", message, content);
    }
    static async success(message, content) {
        return await this.write("success", message, content);
    }
    static async waring(message, content) {
        return await this.write("warning", message, content);
    }
    static async contentToBase64(content) {
        if (!content)
            return null;
        if (content instanceof Buffer) {
            return content.toString('base64');
        }
        if (typeof content == "object") {
            const jsonStr = JSON.stringify(content);
            return this.strToBase64(jsonStr);
        }
        const isFile = (0, fs_1.existsSync)(content);
        if (isFile) {
            const file = (0, fs_1.readFileSync)(content);
            return file.toString('base64');
        }
        return this.strToBase64(content);
    }
    static strToBase64(str) {
        const utf8Str = Buffer.from(str, 'utf-8');
        return utf8Str.toString('base64');
    }
}
exports.Log = Log;
