import { Context } from "./Context";
import { IUseCaseExecutor } from "@core-usecase/IUseCaseExecutor";

export type MiddlewareNextFunc<RequestType, ResponseType, Data> = (context: Context<RequestType, Data>) => Promise<ResponseType> | ResponseType;

export interface IMiddleware<RequestType, ResponseType, RequiredData, NewData=RequiredData>  {
    onContextRequest(context: Context<RequestType, RequiredData & Partial<NewData>>, next: MiddlewareNextFunc<RequestType, ResponseType, RequiredData & Partial<NewData>>): Promise<ResponseType> | ResponseType
}

export class BaseMiddlewareExecutor<RequestType, ResponseType, EndData> implements IUseCaseExecutor<RequestType, ResponseType> {
    constructor(
        protected readonly usecaseExecutor: IUseCaseExecutor<Context<RequestType, EndData>, ResponseType>,
        protected readonly middlewares: IMiddleware<RequestType, ResponseType, Partial<EndData>, Partial<EndData>>[],
    ) {}

    executeUsecase(request: RequestType): ResponseType | Promise<ResponseType> {
        return this.runAllMiddlewares({
            request: request,
            data: {}
        })
    }

    get onUncaughtError() {
        return this.usecaseExecutor.onUncaughtError
    }

    protected runAllMiddlewares(context: Context<RequestType, object>): ResponseType | Promise<ResponseType> {
        const shift = [...this.middlewares];

        const next: MiddlewareNextFunc<RequestType, ResponseType, Partial<EndData>> = (context) => {
            const mdl = shift.shift();
            if (mdl) return mdl.onContextRequest(context, next);
            return this.usecaseExecutor.executeUsecase(context as Context<RequestType, EndData>);
        };

        return next(context);
    }
}