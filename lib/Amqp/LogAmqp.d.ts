import { Log } from "../types";
declare class LogAmqp {
    static publish(log: Log): Promise<void>;
}
export { LogAmqp };
