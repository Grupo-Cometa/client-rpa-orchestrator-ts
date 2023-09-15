type Status = {
    inExecution: boolean,
    ram: string,
    cpu: string,
    versionClient: string
}

type Execution = {
    type: 'execution',
    date: string,
    status: "START" | 'STOP',
    token: string,
    schedule_id: number,
    parameters: string,
    public_id: string | undefined
}

type Log = {
    type: 'log',
    message: string,
    log_type: 'info' | 'warning' | 'error' | 'success',
    public_id: string | undefined
}

export type { Status, Execution, Log }