import { RabbitMQServer } from "./RabbitMqServer"
import { Schedule } from "../types";

class ScheduleSuccessAmqp {
    static async publish(schedule: Schedule) {
        const server = new RabbitMQServer(process.env.AMQP_URL!)
        await server.publish('robots.schedules-success', JSON.stringify(schedule))
    }
}


export { ScheduleSuccessAmqp }

