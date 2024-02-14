import { Schedule } from "../types";
declare class ScheduleSuccessAmqp {
    static publish(schedule: Schedule): Promise<void>;
}
export { ScheduleSuccessAmqp };
