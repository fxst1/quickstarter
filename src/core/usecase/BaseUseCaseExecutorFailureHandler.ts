import { BaseAppError } from "../errors";
import { AnyUseCaseExecutorFailureHandler, IUseCaseExecutorFailureHandler } from "./IUseCaseExecutor";

export abstract class BaseUseCaseExecutorFailureHandler<ResponseType> implements IUseCaseExecutorFailureHandler<ResponseType> {
    abstract onAppError(appError: BaseAppError): ResponseType | Promise<ResponseType>
    abstract onError(error: Error): ResponseType | Promise<ResponseType>

    onUncaughtError(error: Error): ResponseType | Promise<ResponseType> {
        if (error instanceof BaseAppError) {
            return this.onAppError(error)
        } else {
            return this.onError(error)
        }
    }
}

export class BasicUseCaseExecutorFailureHandler<ResponseType> extends BaseUseCaseExecutorFailureHandler<ResponseType> {
    constructor(
        protected readonly errorHandler: AnyUseCaseExecutorFailureHandler<ResponseType, Error>,
        protected readonly appErrorHandler?: AnyUseCaseExecutorFailureHandler<ResponseType, BaseAppError>
    ) {
        super();
    }

    override onAppError(appError: BaseAppError): ResponseType | Promise<ResponseType> {
        if (typeof this.appErrorHandler === 'function') return this.appErrorHandler(appError);
        else if (this.appErrorHandler?.onUncaughtError) return this.appErrorHandler.onUncaughtError(appError);
        return this.onError(appError);
    }

    override onError(error: Error): ResponseType | Promise<ResponseType> {
        if (typeof this.errorHandler === 'function') return this.errorHandler(error);
        else if (this.errorHandler?.onUncaughtError) return this.errorHandler.onUncaughtError(error);
        throw error
    }
} 