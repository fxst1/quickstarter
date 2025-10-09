import { BaseAppError } from "@core/errors";
import { IUseCaseOutputAdapter } from "@core-usecase/IUseCaseAdapter";
import { CliRequest } from "./CliRequest";
import { BaseUseCaseExecutorFailureHandler } from "@core-usecase/BaseUseCaseExecutorFailureHandler";

export abstract class BaseCliResponseFormatter<ObjectType = unknown> {
    abstract format(body: ObjectType): unknown | Promise<unknown>;
}

export class BasicCliResponseFormatter<ObjectType = unknown>  {
    constructor(
        protected readonly formatType: 'json' | 'raw' = 'json'
    ) {}

    format(body: ObjectType): unknown {
        switch (this.formatType) {
            case 'json':
                return JSON.stringify(body, undefined, 4);
            case 'raw':
                return body;
        }
    }
}

////////////////

export class BasicCliUseCaseOutputAdapter<ObjectType = unknown> implements IUseCaseOutputAdapter<CliRequest, CliResponse, ObjectType> {
    constructor(
        protected readonly responseFormatter: BasicCliResponseFormatter<ObjectType> = new BasicCliResponseFormatter()
    ) {}

    createResponse(_context: CliRequest, output: ObjectType): CliResponse | Promise<CliResponse> {
        return new CliResponse(this.responseFormatter.format(output));
    }
}

export class BasicCliFailureResponseFormatter extends BaseUseCaseExecutorFailureHandler<CliResponse> {

    constructor(
        protected readonly responseFormatter: BasicCliResponseFormatter<Error | BaseAppError> = new BasicCliResponseFormatter()
    ) { super() }

    override onAppError(error: BaseAppError): CliResponse | Promise<CliResponse> {
        return new CliResponse(this.responseFormatter.format(error));
    }

    override onError(error: Error): CliResponse | Promise<CliResponse> {
        return new CliResponse(this.responseFormatter.format(error));
    }
}

export class CliResponse {
    constructor(
        readonly rawBody: unknown
    ) {}

    dump() {
        console.log(this.rawBody);
    }
}