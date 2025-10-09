import { BaseMiddlewareExecutor, IMiddleware } from "./IMiddleware";
import { Context } from "./Context";
import { IUseCaseExecutor } from "@core-usecase/IUseCaseExecutor";
import { IRoute } from "./IRoute";

/**
 * Responsible to transform a request into a context for middlewares
 * Then push context to a controller
 */
export abstract class BaseRoute<RequestType, ResponseType, RequiredData = unknown> extends BaseMiddlewareExecutor<RequestType, ResponseType, RequiredData>
    implements IUseCaseExecutor<RequestType, ResponseType>,
                IRoute<RequestType, ResponseType>
{
    constructor(
        usecaseExecutor: IUseCaseExecutor<Context<RequestType, RequiredData>, ResponseType>,
        ...middlewares: IMiddleware<RequestType, ResponseType, unknown, unknown>[]
    ) {
        super(
            usecaseExecutor,
            middlewares
        );
    }
    
    getUsecaseExecutor(): IUseCaseExecutor<RequestType, ResponseType> {
        return this
    }

}
