import { InterfaceMain } from "./InterfaceMain";
import { Status } from "./types";
export declare abstract class Main implements InterfaceMain {
    publishStatus(): Status;
    stop(): Promise<void>;
    abstract start(): Promise<void>;
}
