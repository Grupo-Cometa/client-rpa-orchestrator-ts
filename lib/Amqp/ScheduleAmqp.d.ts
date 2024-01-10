import { Schedule } from "../types";
declare class ScheduleAmqp {
    static consume(): Promise<void>;
    private static sleep;
    static publishDlq(schedule: Schedule): Promise<void>;
    static publishScheduleSuccess(schedule: Schedule): Promise<void>;
}
export { ScheduleAmqp };
