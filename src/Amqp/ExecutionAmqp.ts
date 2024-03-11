import { Execution } from "../types";
import { RabbitMQServer } from "./RabbitMqServer";

class ExecutionAmqp {
    static async publish(execution: Execution) {
        const server = new RabbitMQServer(process.env.AMQP_URL!)
        await server.publish('robots.executions-logs-dlq', JSON.stringify(execution))
    }
}

export { ExecutionAmqp }