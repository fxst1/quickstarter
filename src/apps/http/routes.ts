import { BasicUseCaseAdapter } from "@core-usecase/BaseUseCaseAdapter";
import { BasicUseCaseExecutor } from "@core-usecase/BaseUseCaseExecutor";
import { JSONResponseAdapter, JSONResponseFailureAdapter } from "@core-ext/http/adapters/JSONResponseAdapter";
import { HttpRequest } from "@core-ext/http/HttpRequest";
import { HttpRoute } from "@core-ext/http/HttpRoute";
import { HttpRouter } from "@core-ext/http/HttpRouter";
import { Context } from "@core-router/Context";
import { CreateHelloWorldInput, CreateHelloWorldUsecase } from "@domain-usecase/CreateHelloWorld";
import { ListHelloWorldInput, ListHelloWorldUsecase } from "@domain-usecase/ListHelloWorld";
import { UpdateHelloWorldInput, UpdateHelloWorldUsecase } from "@domain-usecase/UpdateHelloWorld";
import { GetHelloWorldInput, GetHelloWorldUsecase } from "@domain-usecase/GetHelloWorld";
import { HelloWorldCreateModel } from "@domain/models/HelloWorld";
import { helloWorldService } from "@infra/index";


const GetHelloWorldHttpRoute = new HttpRoute({
        methods: ['GET'],
    },
    new BasicUseCaseExecutor(
        new GetHelloWorldUsecase(helloWorldService),
        new BasicUseCaseAdapter(
            (context: Context<HttpRequest, unknown>): GetHelloWorldInput => {
                return {
                    id: context.request.params['id'] ?? ''
                }
            },
            new JSONResponseAdapter(200),
        ),
        new JSONResponseFailureAdapter(),
    )
);

const UpdateHelloWorldHttpRoute = new HttpRoute({
        methods: ['PATCH'],
    },
    new BasicUseCaseExecutor(
        new UpdateHelloWorldUsecase(helloWorldService),
        new BasicUseCaseAdapter(
            async (context: Context<HttpRequest, unknown>): Promise<UpdateHelloWorldInput> => {
                const dryMode = context.request.url.searchParams.get('dry');
                return {
                    id: context.request.params['id'] ?? '',
                    dry: dryMode === 'false' ? false : true,
                    updates: await context.request.json() ?? {}
                }
            },
            new JSONResponseAdapter(200),
        ),
        new JSONResponseFailureAdapter(),
    )
);

const CreateHelloWorldHttpRoute = new HttpRoute({
        methods: ['PUT'],
    },
    new BasicUseCaseExecutor(
        new CreateHelloWorldUsecase(helloWorldService),
        new BasicUseCaseAdapter(
            async (context: Context<HttpRequest, unknown>): Promise<CreateHelloWorldInput> => {
                const dryMode = context.request.url.searchParams.get('dry');
                return {
                    dry: dryMode === 'false' ? false : true,
                    create: await context.request.json() as HelloWorldCreateModel
                }
            },
            new JSONResponseAdapter(200),
        ),
        new JSONResponseFailureAdapter(),
    )
);

const ListHelloWorldHttpRoute = new HttpRoute({
        methods: ['GET'],
    },
    new BasicUseCaseExecutor(
        new ListHelloWorldUsecase(helloWorldService),
        new BasicUseCaseAdapter(
            async (context: Context<HttpRequest, unknown>): Promise<ListHelloWorldInput> => {
                return {
                    offset: parseInt(context.request.url.searchParams.get('skip') ?? '0'),
                    limit: parseInt(context.request.url.searchParams.get('take') ?? '0')
                }
            },
            new JSONResponseAdapter(200),
        ),
        new JSONResponseFailureAdapter(),
    )
);


export class HelloWorldHttpRouter extends HttpRouter {
    constructor() {
        super(
            '/helloworld',
            CreateHelloWorldHttpRoute,
            ListHelloWorldHttpRoute,
            new HelloWorldHttpRouterWithId(),
        )
    }
}

export class HelloWorldHttpRouterWithId extends HttpRouter {
    constructor() {
        super(
            '/helloworld/:id',
            GetHelloWorldHttpRoute,
            UpdateHelloWorldHttpRoute,
        )
    }
}