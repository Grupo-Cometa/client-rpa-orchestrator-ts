import { DuplicatedTaskException } from "cronjob-to-task-scheduler";
import { CrontabScheduleManager } from "../CrontabScheduleManager";
import { WindowsScheduleManager } from "../WindowsScheduleManager";
import { Schedule } from "../types";
import { RabbitMQServer } from "./RabbitMqServer";
import { platform } from "os";
import * as service from "../Services/resendSchedules";
import { Log } from "../Log";
import { ScheduleSuccessAmqp } from "./ScheduleSuccessAmqp";

class ScheduleAmqp {

    async consume() {

        await this.sleep(60000);

        await service.resendSchedules();

        const queue = `robot.schedules.${process.env.PUBLIC_ID}`;
        const server = new RabbitMQServer(process.env.AMQP_URL!);

        await server.consume(queue, async (message) => {
            if (!message) return;

            const schedule = JSON.parse(message.content.toString()) as Schedule;

            if (schedule.action == 'create') await this.create(schedule);
            if (schedule.action == 'delete') await this.delete(schedule);

            await ScheduleSuccessAmqp.publish(schedule);
        })

    }

    private async create(schedule: Schedule) {
        try {
            if (platform() == 'linux') {
                const cronScheduleManager = new CrontabScheduleManager();
                await cronScheduleManager.create(schedule);
            }

            if (platform() == 'win32') {
                const windowsScheduleManager = new WindowsScheduleManager(schedule);
                windowsScheduleManager.create();
            }
        } catch (error: any) {
            if (error instanceof DuplicatedTaskException) return;
            await Log.write('error', `Erro ao criar agendamento: ${error?.message}`)
        }
    }

    private async delete(schedule: Schedule) {
        try {
            if (platform() == 'linux') {
                const cronScheduleManager = new CrontabScheduleManager();
                await cronScheduleManager.delete(schedule);
            }

            if (platform() == 'win32') {
                const windowsScheduleManager = new WindowsScheduleManager(schedule);
                windowsScheduleManager.delete();
            }
        } catch (error: any) {
            await Log.write('error', `Erro ao deletar agendamento: ${error?.message}`)
        }
    }

    private async sleep(ms: number): Promise<void> {
        return await new Promise(resolve => setTimeout(resolve, ms));
    }
}

export { ScheduleAmqp }