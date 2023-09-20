import { InterfaceMain } from "./InterfaceMain";
declare class Start {
    private main;
    constructor(main: InterfaceMain);
    executionShedule(sheduleId?: string, token?: string): Promise<void>;
    private getExecution;
}
export { Start };
