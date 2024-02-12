import { connect } from "amqplib";


class RabbitMqpService {

    public static async createInstace(queue: string) {
        const uri = `amqp://${process.env.AMQP_USER}:${process.env.AMQP_PASSWORD}@${process.env.AMQP_HOST}:${process.env.AMQP_PORT}`

        const conn = await connect(uri);
        const channel = await conn.createChannel();

        await channel.assertQueue(queue, {
            durable: true
        });

        return { conn, channel };
    }
}

export { RabbitMqpService }

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



