import { InterfaceMain } from "./InterfaceMain";
declare class Start {
    private main;
    constructor(main: InterfaceMain);
    executionShedule(sheduleId: number): Promise<void>;
    private getExecution;
}
export { Start };
