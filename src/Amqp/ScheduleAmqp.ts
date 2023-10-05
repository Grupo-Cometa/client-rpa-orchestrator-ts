import { CrontabScheduleManager } from "../CrontabScheduleManager";
import { Schedule } from "../types";
import { RabbitMQServer } from "./RabbitMqServer";

class ScheduleAmqp {

    static async consume() {
        const queue = `robot.schedules.${process.env.PUBLIC_ID}`;
        const server = new RabbitMQServer(process.env.AMQP_URL!)
        await server.consume(queue, (message) => {
            if(!message) return; 
            const schedule = JSON.parse(message.content.toString()) as Schedule;
            const cronScheduleManager = new CrontabScheduleManager();
            if(schedule.action == 'create') {
                try {
                    cronScheduleManager.create(schedule);
                } catch(error: unknown) {
                    this.publishDlq(schedule);
                }
            }
            
            if(schedule.action == 'delete') cronScheduleManager.delete(schedule);
        })
    }

    static async publishDlq(schedule: Schedule) {
        const server = new RabbitMQServer(process.env.AMQP_URL!)
        await server.publish('robots.schedules-dlq', JSON.stringify(schedule))
    }
}

export { ScheduleAmqp }