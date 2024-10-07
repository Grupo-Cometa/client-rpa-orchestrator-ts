import { Execution } from "../types";
import { RabbitMQServer } from "./RabbitMqServer";

class ExecutionAmqp {
    static async publish(execution: Execution) {
        try {
            const server = new RabbitMQServer(process.env.AMQP_URL!)
            await server.publish('robots.executions-logs', JSON.stringify(execution))
        } catch(error: unknown) {
            
        } 
    }
}

export { ExecutionAmqp }