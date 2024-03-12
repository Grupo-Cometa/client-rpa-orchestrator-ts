import { Schedule } from "./types";
declare class WindowsScheduleManager {
    private schedule;
    constructor(schedule: Schedule);
    create(): void;
    delete(): void;
    private getScheduleName;
    private getScheduleCommand;
}
export { WindowsScheduleManager };
