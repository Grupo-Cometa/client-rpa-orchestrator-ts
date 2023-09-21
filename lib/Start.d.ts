import { InterfaceMain } from "./InterfaceMain";
declare class Start {
    private main;
    constructor(main: InterfaceMain);
    execute(sheduleId?: string, token?: string): Promise<void>;
    private getExecution;
}
export { Start };
