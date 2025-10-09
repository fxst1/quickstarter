import { IRoute } from "./IRoute";
import { IRouter } from "./IRouter";

export type AnyRouteOrRouter<RequestType, ResponseType, RouteType extends IRoute<RequestType, ResponseType> = IRoute<RequestType, ResponseType>,
    RouterType extends IRouter<RequestType, ResponseType, RouteType> = IRouter<RequestType, ResponseType, RouteType>> 
    = RouteType | RouterType;

export abstract class BaseRouter<
    RequestType,
    ResponseType,
    RouteType extends IRoute<RequestType, ResponseType> = IRoute<RequestType, ResponseType>,
    RouterType extends IRouter<RequestType, ResponseType, RouteType> = IRouter<RequestType, ResponseType, RouteType>
>
    implements IRouter<RequestType, ResponseType, RouteType> {
    
    protected readonly routesOrRouters: AnyRouteOrRouter<RequestType, ResponseType, RouteType, RouterType>[]
    constructor(
        ...routes: AnyRouteOrRouter<RequestType, ResponseType, RouteType, RouterType>[]
    ) {
        this.routesOrRouters = [...routes];
    }

    getRoutes(): RouteType[] {
        return this.routesOrRouters.filter((item) => 'getUsecaseExecutor' in item);
    }

    getRouters(): RouterType[] {
        return this.routesOrRouters.filter((item) => 'mountRoute' in item);
    }

    getRoutesAndRouters(): (RouteType | RouterType)[] {
        return this.routesOrRouters;
    }

    abstract mountRoute(route: RouteType): void
    abstract mountRouter(router: RouterType): void

    notify() {
        for (const route of this.routesOrRouters) {
            if ('getUsecaseExecutor' in route) this.mountRoute(route);
            else {
                this.mountRouter(route);
                if ('notify' in route && typeof route.notify === 'function') route.notify()
            }
        }
    }
}
