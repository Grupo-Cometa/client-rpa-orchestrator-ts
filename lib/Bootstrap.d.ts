import { InterfaceMain } from "./InterfaceMain";
export declare class Bootstrap {
    private main;
    private start;
    constructor(main: InterfaceMain);
    run(): Promise<void>;
    publishStatus: () => {
        inExecution: boolean;
        cpu: string;
        ram: string;
        versionClient: string;
    };
    stop: () => void;
}
