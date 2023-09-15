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
    async executionShedule(sheduleId) {
        ExecutionAmqp_1.ExecutionAmqp.publish(this.getExecution("START", sheduleId));
        await this.main.start();
        ExecutionAmqp_1.ExecutionAmqp.publish(this.getExecution("STOP", sheduleId));
    }
    getExecution(status, schedule_id) {
        return {
            date: (0, moment_1.default)().format('YYYY-MM-DD HH:mm:ss'),
            status,
            public_id: process.env.PUBLIC_ID,
            schedule_id,
            type: "execution",
            token: "",
            parameters: "{}"
        };
    }
}
exports.Start = Start;
