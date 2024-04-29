import { InterfaceMain } from "./InterfaceMain";
export declare class Bootstrap {
    private main;
    private start;
    constructor(main: InterfaceMain);
    private sleep;
    run(): Promise<void>;
    protected publishStatus: () => {
        inExecution: boolean;
        cpu: string;
        ram: string;
        versionClient: string;
    };
    protected stop: () => void;
}
