type Schedule = {
    action: 'create' | 'delete';
    cronExpression: string;
    robotPublicId: string;
    scheduleId: number;
};
declare class CronScheduleManager {
    private username;
    private autoCommit;
    constructor(username?: string, autoCommit?: boolean);
    private getCronsText;
    private existSchedule;
    create(schedule: Schedule): Promise<void>;
    private write;
    commit(): void;
    private command;
    delete(schedule: Schedule): Promise<void>;
}
export { CronScheduleManager };
