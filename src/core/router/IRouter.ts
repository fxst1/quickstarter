import { IRoute } from "./IRoute";

/**
 * Convert a request into an IRoute with multiplexing
 */
export interface IRouter<RequestType, ResponseType, RouteType extends IRoute<RequestType, ResponseType> = IRoute<RequestType, ResponseType>> {
    mountRoute(route: RouteType): void
    mountRouter(router: IRouter<RequestType, ResponseType, RouteType>): void;
}
