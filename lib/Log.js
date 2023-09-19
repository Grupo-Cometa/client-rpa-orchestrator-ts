"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Log = void 0;
const LogAmqp_1 = require("./Amqp/LogAmqp");
const printScreen_1 = require("./Utils/printScreen");
const LogSocket_1 = require("./WebSocket/LogSocket");
class Log {
    static async write(type, message) {
        try {
            if (process.env.DEBUG?.toLowerCase() == 'true') {
                return printScreen_1.printScreen[type](message);
            }
            const log = {
                log_type: type,
                message,
                public_id: process.env.PUBLIC_ID,
                type: 'log'
            };
            LogSocket_1.LogSocket.send(log);
            await LogAmqp_1.LogAmqp.publish(log);
        }
        catch (error) {
            printScreen_1.printScreen[type](message);
        }
    }
}
exports.Log = Log;
