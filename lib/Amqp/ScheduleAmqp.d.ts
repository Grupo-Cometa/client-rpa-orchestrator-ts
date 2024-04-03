declare class ScheduleAmqp {
    consume(): Promise<void>;
    private create;
    private delete;
    private sleep;
}
export { ScheduleAmqp };
