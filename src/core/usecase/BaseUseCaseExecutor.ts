import { IUseCase } from "./IUseCase";
import { IUseCaseAdapter } from "./IUseCaseAdapter";
import { AnyUseCaseExecutorFailureHandler, IUseCaseExecutor } from "./IUseCaseExecutor";

/**
 * Responsible to transform a request into a context for middlewares
 * Then push context to a controller
 */
export class BasicUseCaseExecutor<RequestType, ResponseType, UsecaseInput, UsecaseOutput> implements IUseCaseExecutor<RequestType, ResponseType> {

    constructor(
        protected readonly usecase: IUseCase<UsecaseInput, UsecaseOutput>,
        protected readonly usecaseAdapter: IUseCaseAdapter<RequestType, ResponseType, UsecaseInput, UsecaseOutput>,
        protected readonly usecaseFailureHandler?: AnyUseCaseExecutorFailureHandler<ResponseType>
    ) { }

    getUsecase(): IUseCase<UsecaseInput, UsecaseOutput> {
        return this.usecase
    }

    getUsecaseAdapter(): IUseCaseAdapter<RequestType, ResponseType, UsecaseInput, UsecaseOutput> {
        return this.usecaseAdapter
    }

    executeUsecase(request: RequestType): ResponseType | Promise<ResponseType> {
        return Promise.resolve( this.usecaseAdapter.createInput(request) )
            .then(
                (ucInput) => {
                    const p = Promise.resolve(this.usecase.execute(ucInput));
                    if (this.usecase.onError) {
                        return p.catch(
                            (e) => this.usecase.onError!(ucInput, e)
                        )
                    }
                    return p;
            })
            .then(
                (ucOutput) => this.usecaseAdapter.createResponse(request, ucOutput)
            ).catch((e) => {
                if (this.onUncaughtError) return this.onUncaughtError(e)
                throw e;
            });
    }

    get onUncaughtError() {
        if (this.usecaseFailureHandler) {
            if (typeof this.usecaseFailureHandler === 'function')
                return this.usecaseFailureHandler;
            else if (this.usecaseFailureHandler.onUncaughtError)
                return this.usecaseFailureHandler.onUncaughtError.bind( this.usecaseFailureHandler )
        }
    }
}