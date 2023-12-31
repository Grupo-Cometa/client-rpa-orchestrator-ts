import { Schedule } from './types';
declare class CrontabScheduleManager {
    private username;
    private autoCommit;
    constructor(username?: string, autoCommit?: boolean);
    getCronsText(): string;
    private existSchedule;
    create(schedule: Schedule): Promise<void>;
    private write;
    commit(): void;
    private command;
    delete(schedule: Schedule): Promise<void>;
}
export { CrontabScheduleManager };
