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
    static async write(typeLog, message, content) {
        try {
            if (process.env.DEBUG?.toLowerCase() == 'true') {
                printScreen_1.printScreen[typeLog](message);
            }
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
            return btoa(JSON.stringify(content));
        }
        const isFile = (0, fs_1.existsSync)(content);
        if (isFile) {
            const file = (0, fs_1.readFileSync)(content);
            return file.toString('base64');
        }
        return btoa(content);
    }
}
exports.Log = Log;
