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
    token?: string,
    schedule_id: string,
    parameters: string,
    public_id: string | undefined
}

type Log = {
    type: 'log',
    message: string,
    log_type: 'info' | 'warning' | 'error' | 'success',
    public_id: string | undefined,
    date: string
}

type Schedule = {
    action: 'create'|'delete',
    cronExpression: string,
    robotPublicId: string,
    scheduleId: number
}

export type { Status, Execution, Log, Schedule }