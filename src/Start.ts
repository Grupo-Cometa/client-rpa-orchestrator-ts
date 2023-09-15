import { ExecutionAmqp } from "./Amqp/ExecutionAmqp";
import { InterfaceMain } from "./InterfaceMain";
import moment from 'moment';
import { Execution } from "./types";

class Start {
    constructor(private main: InterfaceMain) {

    }

    async executionShedule(sheduleId?: string) {
        
        ExecutionAmqp.publish(this.getExecution("START", sheduleId))
        await this.main.start()
        ExecutionAmqp.publish(this.getExecution("STOP", sheduleId))
    }

    private getExecution(status: Execution["status"], schedule_id?: string): Execution {
        return {
            date: moment().format('YYYY-MM-DD HH:mm:ss'),
            status,
            public_id: process.env.PUBLIC_ID,
            schedule_id: (schedule_id == undefined) ? '' : schedule_id,
            type: "execution",
            token: "",
            parameters: "{}"
        }
    }
}

export { Start }