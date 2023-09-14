import { Status } from "./types";

interface InterfaceMain {
    start(): Promise<void> ;
    stop(): Promise<void>;
    publishStatus(): Status
}

export type { InterfaceMain }