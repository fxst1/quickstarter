import { IApplication } from '@core/application/IApplication';
import { HttpRequest } from '../HttpRequest';

import * as express from 'express'

import { AnyHttpRoute, HttpRouteMethods } from '../HttpRoute';
import { AnyHttpRouteOrRouter, HttpRouter } from '../HttpRouter';

class ExpressHttpRouter extends HttpRouter {

    constructor(
        protected readonly expressRouter: express.Router,
        path: string,
        ...routes: AnyHttpRouteOrRouter[]
    ) {
        super(path, ...routes)
    }

    override mountRouter(router: HttpRouter): void {
        const tempRouter = new ExpressHttpRouter(
            express.Router(),
            router.path,
            ...[
                ...router.getRouters(),
                ...router.getRoutes(),
            ]
        );
        tempRouter.notify();
        this.expressRouter.use(tempRouter.expressRouter);
    }

    override mountRoute(route: AnyHttpRoute): void {

        for (const method of route.options.methods) {
            const fullpath = `${this.path}${route.options.path ?? ''}`;
            console.log('Mounting', method, fullpath);
            switch (method) {
                case 'GET':
                    this.expressRouter.get(fullpath, this.createExpressHandler(route));
                    break;
                case 'OPTIONS':
                    this.expressRouter.options(fullpath, this.createExpressHandler(route));
                    break;
                case 'POST':
                    this.expressRouter.post(fullpath, this.createExpressHandler(route));
                    break;
                case 'PUT':
                    this.expressRouter.put(fullpath, this.createExpressHandler(route));
                    break;
                case 'PATCH':
                    this.expressRouter.patch(fullpath, this.createExpressHandler(route));
                    break;
                case 'DELETE':
                    this.expressRouter.delete(fullpath, this.createExpressHandler(route));
                    break;
            }
        }
    }

    createExpressHandler(route: AnyHttpRoute) {
        return async (req: express.Request, res: express.Response) =>  {
            console.log('In route', route);

            const response = await route.executeUsecase(new HttpRequest({
                url: new URL(req.url.toString(), 'https://localhost'),
                method: req.method as HttpRouteMethods,
                bodyReader: {
                    json: () => req.body,
                    text: () => req.body
                },
                params: req.params
            }));

            res.status(response.status);
            for (const responseHeaderKey in response.headers) {
                res.setHeader(responseHeaderKey, response.headers[responseHeaderKey]);
            }
            res.json(response.body);
        }
    }
}

export class ExpressHttpApplication extends ExpressHttpRouter implements IApplication {

    protected readonly app: express.Express;

    constructor(
        protected readonly port: number,
        ...routes: (AnyHttpRoute | HttpRouter)[]
    ) {
        const app = express.default();
        app.use(express.json());
        super(app, "/", ...routes)
        this.app = app;
    }

    listen(port?: number) {
        console.log('Listing on port', port ?? this.port);
        this.app.listen(port ?? this.port);
    }

    run() {
        this.notify();
        this.listen();
    }
}