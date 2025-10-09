export interface Context<ApplicationRequestType, Data = object> {
    request: ApplicationRequestType
    data: Data
}

export interface MergedContext<ApplicationRequestType, NewData, PrevData> extends Context<ApplicationRequestType, NewData & PrevData> {
    request: ApplicationRequestType
    data: NewData & PrevData
}