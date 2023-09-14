export declare class Triggers {
    start(callback: () => Promise<void>): Promise<void>;
    stop(callback: () => Promise<void>): Promise<void>;
}
