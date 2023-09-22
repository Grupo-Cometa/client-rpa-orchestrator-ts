"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Start = void 0;
const ExecutionAmqp_1 = require("./Amqp/ExecutionAmqp");
const moment_1 = __importDefault(require("moment"));
class Start {
    main;
    constructor(main) {
        this.main = main;
    }
    async execute(sheduleId, token) {
        await this.sleep(1000);
        await ExecutionAmqp_1.ExecutionAmqp.publish(this.getExecution("START", sheduleId, token));
        try {
            await this.main.start();
        }
        catch (error) {
            console.error(error);
        }
        finally {
            await ExecutionAmqp_1.ExecutionAmqp.publish(this.getExecution("STOP", sheduleId, token));
        }
    }
    async sleep(milliseconds) {
        return new Promise((resolve) => {
            setTimeout(resolve, milliseconds);
        });
    }
    getExecution(status, schedule_id, token) {
        return {
            date: (0, moment_1.default)().format('YYYY-MM-DD HH:mm:ss'),
            status,
            public_id: process.env.PUBLIC_ID,
            schedule_id: (schedule_id == undefined) ? '' : schedule_id,
            type: "execution",
            token: (token == undefined) ? '' : token,
            parameters: "{}"
        };
    }
}
exports.Start = Start;
