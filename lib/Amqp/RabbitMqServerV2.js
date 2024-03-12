"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RabbitMqpService = void 0;
const amqplib_1 = require("amqplib");
class RabbitMqpService {
    static async createInstace(queue) {
        const uri = `amqp://${process.env.AMQP_USER}:${process.env.AMQP_PASSWORD}@${process.env.AMQP_HOST}:${process.env.AMQP_PORT}`;
        const conn = await (0, amqplib_1.connect)(uri);
        const channel = await conn.createChannel();
        await channel.assertQueue(queue, {
            durable: true
        });
        return { conn, channel };
    }
}
exports.RabbitMqpService = RabbitMqpService;
// import "../helpers/env"
// import { RabbitMqpService } from "../Services/Amqp/RabbitMqpService";
// import { ConsumeMessage } from "amqplib";
// (async () => {
//     const {conn, channel} = await RabbitMqpService.createInstace("robot.schedules.teste1")
//     await channel.consume("robot.schedules.teste1", (msg: ConsumeMessage | null) => {
//         if (!msg) return;
//         try {
//             console.log(msg)
//             // channel.ack(msg)
//         } catch (error) {
//             // channel.reject(msg, false);
//             console.log('error', msg)
//         }
//     }, {
//         noAck: false
//     })
// })()
