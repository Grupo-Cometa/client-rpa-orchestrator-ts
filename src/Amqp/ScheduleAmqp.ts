import { DuplicatedTaskException } from "cronjob-to-task-scheduler";
import { CrontabScheduleManager } from "../CrontabScheduleManager";
import { WindowsScheduleManager } from "../WindowsScheduleManager";
import { Schedule } from "../types";
import { RabbitMQServer } from "./RabbitMqServer";
import { platform } from "os";

class ScheduleAmqp {

    static async consume() {
        const queue = `robot.schedules.${process.env.PUBLIC_ID}`;
        const server = new RabbitMQServer(process.env.AMQP_URL!);

        await server.consume(queue, (message) => {
            if(!message) return; 
            const schedule = JSON.parse(message.content.toString()) as Schedule;
            
            if(schedule.action == 'create') {
                try {
                    if(platform() == 'linux') {
                        const cronScheduleManager = new CrontabScheduleManager();
                        cronScheduleManager.create(schedule);
                    }

                    if(platform() == 'win32') {
                        const windowsScheduleManager = new WindowsScheduleManager(schedule);
                        windowsScheduleManager.create();
                    } 
                } catch(error: unknown) {
                    if(error instanceof DuplicatedTaskException) return;
                    this.publishDlq(schedule);
                }
            }
            
            if(schedule.action == 'delete'){
                if(platform() == 'linux') {
                    const cronScheduleManager = new CrontabScheduleManager();
                    cronScheduleManager.delete(schedule);
                }

                if(platform() == 'win32') {
                    const windowsScheduleManager = new WindowsScheduleManager(schedule);
                    windowsScheduleManager.delete();
                }
            }
        })
    }

    static async publishDlq(schedule: Schedule) {
        const server = new RabbitMQServer(process.env.AMQP_URL!)
        await server.publish('robots.schedules-dlq', JSON.stringify(schedule))
    }
}

export { ScheduleAmqp }