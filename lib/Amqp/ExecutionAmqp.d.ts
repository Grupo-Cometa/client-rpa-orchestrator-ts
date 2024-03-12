import { Execution } from "../types";
declare class ExecutionAmqp {
    static publish(execution: Execution): Promise<void>;
}
export { ExecutionAmqp };
