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
    schedule_id: number,
    parameters?: string,
    public_id: string | undefined
}

export type { Status, Execution }