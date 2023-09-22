import { ExecutionAmqp } from "./Amqp/ExecutionAmqp";
import { InterfaceMain } from "./InterfaceMain";
import moment from 'moment';
import { Execution } from "./types";

class Start {

    constructor(private main: InterfaceMain) {}

    async execute(sheduleId?: string, token?: string) {
        ExecutionAmqp.publish(this.getExecution("START", sheduleId, token))
        await this.main.start()
        ExecutionAmqp.publish(this.getExecution("STOP", sheduleId, token))
    }

    private getExecution(status: Execution["status"], schedule_id?: string, token?: string): Execution {
        return {
            date: moment().format('YYYY-MM-DD HH:mm:ss'),
            status,
            public_id: process.env.PUBLIC_ID,
            schedule_id: (schedule_id == undefined) ? '' : schedule_id,
            type: "execution",
            token: (token == undefined) ? '' : token,
            parameters: "{}"
        }
    }
}

export { Start }