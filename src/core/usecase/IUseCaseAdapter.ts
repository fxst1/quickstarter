export interface IUseCaseAdapter<RequestType, ResponseType, UcInput, UcOutput> {
    createInput(context: RequestType): UcInput | Promise<UcInput>;
    createResponse(context: RequestType, output: UcOutput): ResponseType | Promise<ResponseType>;
}

export interface IUseCaseInputAdapter<RequestType, UcInput> {
    createInput(context: RequestType): UcInput | Promise<UcInput>;
}

export interface IUseCaseOutputAdapter<RequestType, ResponseType, UcOutput> {
    createResponse(context: RequestType, output: UcOutput): ResponseType | Promise<ResponseType>;
}

export type UseCaseAdapterInputFunc<RequestType, UcInput> = (request: RequestType) => UcInput | Promise<UcInput>;
export type UseCaseAdapterOutputFunc<RequestType, ResponseType, UcOutput> = (request: RequestType, output: UcOutput) => ResponseType | Promise<ResponseType>;

export type AnyUseCaseInputAdapter<RequestType, UcInput> = UseCaseAdapterInputFunc<RequestType, UcInput> | IUseCaseInputAdapter<RequestType, UcInput> | IUseCaseAdapter<RequestType, unknown, UcInput, unknown>;
export type AnyUseCaseOutputAdapter<RequestType, ResponseType, UcOutput> = UseCaseAdapterOutputFunc<RequestType,  ResponseType, UcOutput> | IUseCaseOutputAdapter<RequestType, ResponseType, UcOutput> | IUseCaseAdapter<RequestType, ResponseType, unknown, UcOutput>;