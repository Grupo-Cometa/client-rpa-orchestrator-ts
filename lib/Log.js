"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Log = void 0;
const LogAmqp_1 = require("./Amqp/LogAmqp");
const printScreen_1 = require("./Utils/printScreen");
const LogSocket_1 = require("./WebSocket/LogSocket");
const moment_1 = __importDefault(require("moment"));
const fs = __importStar(require("fs"));
class Log {
    static async write(type, message, writeFileLog = false) {
        try {
            printScreen_1.printScreen[type](message);
            if (writeFileLog)
                fs.appendFileSync('/var/log/orquestrado.log', `[${new Date}] ${message} [${type}]`);
            if (process.env.DEBUG?.toLowerCase() == 'false') {
                const log = {
                    log_type: type,
                    message,
                    public_id: process.env.PUBLIC_ID,
                    type: 'log',
                    date: (0, moment_1.default)().format('YYYY-MM-DD HH:mm:ss')
                };
                LogSocket_1.LogSocket.send(log);
                await LogAmqp_1.LogAmqp.publish(log);
            }
        }
        catch (error) {
            printScreen_1.printScreen[type](message);
        }
    }
}
exports.Log = Log;
