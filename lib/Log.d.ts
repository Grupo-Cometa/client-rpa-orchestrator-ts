import { Log as LogType } from "./types";
export declare class Log {
    static write(type: LogType["log_type"], message: string, writeFileLog?: boolean): Promise<void>;
}
