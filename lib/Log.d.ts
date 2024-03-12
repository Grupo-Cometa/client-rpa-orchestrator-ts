/// <reference types="node" />
import { Log as LogType } from "./types";
type Content = Buffer | string | object;
export declare class Log {
    private static currentDateStr;
    private static printScreen;
    static write(typeLog: LogType["log_type"], message: string, content?: Content): Promise<void>;
    static info(message: string, content?: Content): Promise<void>;
    static error(message: string, content?: Content): Promise<void>;
    static success(message: string, content?: Content): Promise<void>;
    static waring(message: string, content?: Content): Promise<void>;
    private static contentToBase64;
}
export {};
