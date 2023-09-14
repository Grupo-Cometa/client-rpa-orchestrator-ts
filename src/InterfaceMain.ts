import { Status } from "./types";

interface InterfaceMain {
    start(): Promise<void> ;
    stop?: Function;
    publishStatus?: Function;
}

export type { InterfaceMain }