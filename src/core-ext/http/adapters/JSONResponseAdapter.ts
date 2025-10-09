import { IUseCaseOutputAdapter } from "@core-usecase/IUseCaseAdapter";
import { HttpResponse } from "../HttpResponse";
import { BaseUseCaseExecutorFailureHandler } from "@core-usecase/BaseUseCaseExecutorFailureHandler";
import { BaseAppError } from "@core/errors";

export class JSONResponseAdapter<UcOutput = unknown> implements IUseCaseOutputAdapter<unknown, HttpResponse, UcOutput> {
    constructor(
        protected readonly responseStatus: number = 200
    ) {}

    createResponse(_context: unknown, output: UcOutput): HttpResponse | Promise<HttpResponse> {
        return new HttpResponse({
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            },
            body: output
        })
    }
}

export class JSONResponseFailureAdapter extends BaseUseCaseExecutorFailureHandler<HttpResponse> {

    override onAppError(error: BaseAppError): HttpResponse {
        console.warn(error, error.stack);
        return new HttpResponse({
            status: error.codeValue,
            body: {
                error: error.codeName,
                detail: error.detail,
                reason: error.cause
            }
        })
    }

    override onError(error: Error): HttpResponse {
        console.error(error, error.stack);
        return new HttpResponse({
            status: 500,
            body: {
                error: "INTERNAL_ERROR",
            }
        })
    }


}