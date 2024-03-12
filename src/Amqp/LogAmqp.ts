import { Log } from "../types";
import { RabbitMQServer } from "./RabbitMqServer";

class LogAmqp {
    static async publish(log: Log) {
        const server = new RabbitMQServer(process.env.AMQP_URL!)
        await server.publish('robots.executions-logs', JSON.stringify(log))
    }
}

export { LogAmqp }