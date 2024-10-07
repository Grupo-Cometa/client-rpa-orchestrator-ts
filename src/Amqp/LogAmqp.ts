import { Log } from "../types";
import { RabbitMQServer } from "./RabbitMqServer";

class LogAmqp {
    static async publish(log: Log) {
        try {
            const server = new RabbitMQServer(process.env.AMQP_URL!)
            await server.publish('robots.executions-logs', JSON.stringify(log))
        } catch(error: unknown) {
            
        }
    }
}

export { LogAmqp }