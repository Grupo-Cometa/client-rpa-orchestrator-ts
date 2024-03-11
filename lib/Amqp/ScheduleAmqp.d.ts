declare class ScheduleAmqp {
    consume(): Promise<void>;
    private create;
    private delete;
    private sleep;
    private publishDlq;
}
export { ScheduleAmqp };
