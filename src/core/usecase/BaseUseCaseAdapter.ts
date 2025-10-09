import { AnyUseCaseInputAdapter, AnyUseCaseOutputAdapter, IUseCaseAdapter } from "./IUseCaseAdapter";

export abstract class BaseUseCaseAdapter<RequestType, ResponseType, UcInput, UcOutput> implements IUseCaseAdapter<RequestType, ResponseType, UcInput, UcOutput> {
    abstract createInput(context: RequestType): UcInput | Promise<UcInput>
    abstract createResponse(context: RequestType, output: UcOutput): ResponseType | Promise<ResponseType>
}

export class BasicUseCaseAdapter<RequestType, ResponseType, UcInput, UcOutput> extends BaseUseCaseAdapter<RequestType, ResponseType, UcInput, UcOutput> {
    constructor(
        protected readonly inputUseCaseAdapter: AnyUseCaseInputAdapter<RequestType, UcInput>,
        protected readonly outputUseCaseAdapter: AnyUseCaseOutputAdapter<RequestType, ResponseType, UcOutput>
    ) { super() }

    createInput(context: RequestType): UcInput | Promise<UcInput> {
        if (typeof this.inputUseCaseAdapter === 'function') return this.inputUseCaseAdapter(context);
        else return this.inputUseCaseAdapter.createInput(context);
    }

    createResponse(context: RequestType, output: UcOutput): ResponseType | Promise<ResponseType> {
        if (typeof this.outputUseCaseAdapter === 'function') return this.outputUseCaseAdapter(context, output);
        else return this.outputUseCaseAdapter.createResponse(context, output);
    }

}