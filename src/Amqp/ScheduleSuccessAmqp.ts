import { Log } from "../Log"
import { RabbitMQServer } from "./RabbitMqServer"
import { Schedule } from "../types";

class ScheduleSuccessAmqp {
    static async publish(schedule: Schedule) {
        await Log.write('info', 'excultando publishScheduleSuccess')
        const server = new RabbitMQServer(process.env.AMQP_URL!)
        await server.publish('robots.schedules-success', JSON.stringify(schedule))
    }
}


export { ScheduleSuccessAmqp }

