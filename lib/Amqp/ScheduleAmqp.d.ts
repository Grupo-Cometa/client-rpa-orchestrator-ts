import { Schedule } from "../types";
declare class ScheduleAmqp {
    static consume(): Promise<void>;
    static publishDlq(schedule: Schedule): Promise<void>;
}
export { ScheduleAmqp };
