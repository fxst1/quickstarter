import { Context } from "./Context";
import { IMiddleware, MiddlewareNextFunc } from "./IMiddleware";

export abstract class BaseMiddleware<RequestType, ResponseType, RequiredData=unknown, NewData=RequiredData> implements IMiddleware<RequestType, ResponseType, RequiredData, NewData> {

    protected abstract preHandle?(
        context: Context<RequestType, RequiredData & Partial<NewData>>,
    ): Promise<ResponseType | void> | ResponseType | void;

    protected abstract postHandle?(
        context: Context<RequestType, RequiredData & Partial<NewData>>,
        response: ResponseType
    ): Promise<ResponseType> | ResponseType;

    onContextRequest(
        context: Context<RequestType, RequiredData & Partial<NewData>>,
        next: MiddlewareNextFunc<RequestType, ResponseType, RequiredData & Partial<NewData>>
    ): Promise<ResponseType> | ResponseType {
        return Promise.resolve(this.preHandle ? this.preHandle(context) : undefined)
            .then((resp) => {
                if (resp === undefined) return next(context)
                return resp;
            })
            .then((resp) => {
                if (this.postHandle) {
                    return this.postHandle(context, resp);
                }
                return resp;
            });
    }
}