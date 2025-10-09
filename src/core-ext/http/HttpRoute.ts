import { BaseRoute } from "@core-router/BaseRoute";
import { Context } from "@core-router/Context";
import { IMiddleware } from "@core-router/IMiddleware";
import { IUseCaseExecutor } from "@core-usecase/IUseCaseExecutor";
import { HttpRequest } from "./HttpRequest";
import { HttpResponse } from "./HttpResponse";

export type HttpRouteMethods =  'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE' | 'OPTIONS';
const AllRouteMethod: HttpRouteMethods[] = ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'];

export type HttpRouteOptions = {
    methods: HttpRouteMethods[];
    path?: string;
}


export class HttpRoute extends BaseRoute<HttpRequest, HttpResponse> {
    constructor(
        public readonly options: HttpRouteOptions,
        usecaseExecutor: IUseCaseExecutor<Context<HttpRequest, unknown>, HttpResponse>,
        ...middlewares: IMiddleware<HttpRequest, HttpResponse, unknown, unknown>[]
        
    ) {
        super(usecaseExecutor, ...middlewares);
        if (options.methods.length === 0) this.options.methods = AllRouteMethod;
    }
}

export type AnyHttpRoute = HttpRoute;