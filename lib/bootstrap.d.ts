import { InterfaceMain } from "./InterfaceMain";
export declare class Bootstrap {
    private main;
    constructor(main: InterfaceMain);
    run(): void;
    start(): void;
    publishStatus: () => {
        inExecution: boolean;
        cpu: string;
        ram: string;
        versionClient: string;
    };
    stop: () => void;
}
