import { AnyRouteOrRouter, BaseRouter } from "@core-router/BaseRouter";
import { HttpRequest } from "./HttpRequest";
import { HttpResponse } from "./HttpResponse";
import { AnyHttpRoute } from "./HttpRoute";
import { IRouter } from "@core-router/IRouter";

export type AnyHttpRouteOrRouter = AnyRouteOrRouter<HttpRequest, HttpResponse, AnyHttpRoute>;
export class HttpRouter extends BaseRouter<HttpRequest, HttpResponse, AnyHttpRoute> {
    mountRoute(_route: AnyHttpRoute): void {}
    mountRouter(_router: IRouter<HttpRequest, HttpResponse, AnyHttpRoute>): void {}

    constructor(
        public readonly path: string,
        ...routes: AnyHttpRouteOrRouter[]
    ) { super(...routes) }


}