import { BasicUseCaseAdapter } from "@core-usecase/BaseUseCaseAdapter";
import { BasicUseCaseExecutor } from "@core-usecase/BaseUseCaseExecutor";
import { GetHelloWorldInput, GetHelloWorldUsecase } from "@domain-usecase/GetHelloWorld";
import { CliRequest } from "@core-ext/cli/CliRequest";
import { CliRoute } from "@core-ext/cli/CliRoute";
import { CliRouter } from "@core-ext/cli/CliRouter";
import { BasicCliFailureResponseFormatter, BasicCliUseCaseOutputAdapter } from "@core-ext/cli/CliResponse";

import { CreateHelloWorldInput, CreateHelloWorldUsecase } from "@domain-usecase/CreateHelloWorld";
import { ListHelloWorldInput, ListHelloWorldUsecase } from "@domain-usecase/ListHelloWorld";
import { UpdateHelloWorldInput, UpdateHelloWorldUsecase } from "@domain-usecase/UpdateHelloWorld";
import { helloWorldService } from "@infra/index";


const GetHelloWorldCliRoute = new CliRoute({
        name: 'get',
        description: 'Fetch HelloWorldModel details',
        options: [
            { name: 'HelloWorldId', long: '--id'},
        ]
    },
    new BasicUseCaseExecutor(
        new GetHelloWorldUsecase(helloWorldService),
        new BasicUseCaseAdapter(
            (request: CliRequest): GetHelloWorldInput => {
                return {
                    id: request.get<string>('HelloWorldId') ?? ''
                }
            },
            new BasicCliUseCaseOutputAdapter(),
        ),
        new BasicCliFailureResponseFormatter(),
    )
);

const UpdateHelloWorldCliRoute = new CliRoute({
        name: 'update',
        description: 'Update a HelloWorldModel',
        options: [
            { name: "HelloWorldId", long: '--id' },
            { name: "HelloWorldUsername", long: '--username', short: '-u', type: 'string' },
            { name: "Dry", description: "Dry mode", short: '-d', long: '--dry', type: 'boolean'}
        ]
    },
    new BasicUseCaseExecutor(
        new UpdateHelloWorldUsecase(helloWorldService),
        new BasicUseCaseAdapter(
            (request: CliRequest): UpdateHelloWorldInput => {
                return {
                    id: request.get<string>('HelloWorldId') ?? '',
                    dry: request.get<boolean>("Dry"),
                    updates: {
                        username: request.get<string>("HelloWorldUsername"),
                    }
                }
            },
            new BasicCliUseCaseOutputAdapter(),
        ),
        new BasicCliFailureResponseFormatter(),
    )
);

const CreateHelloWorldCliRoute = new CliRoute({
        name: 'create',
        description: 'Create a HelloWorldModel',
        options: [
            { name: "HelloWorldUsername", long: '--username', short: '-u', type: 'string' },
            { name: "HelloWorldEmail", long: '--email', short: '-e', type: 'string' },
            { name: "Dry", description: "Dry mode", short: '-d', long: '--dry', type: 'boolean'}
        ]
    },
    new BasicUseCaseExecutor(
        new CreateHelloWorldUsecase(helloWorldService),
        new BasicUseCaseAdapter(
            (request: CliRequest): CreateHelloWorldInput => {
                return {
                    dry: request.get<boolean>("Dry"),
                    create: {
                        username: request.get<string>("HelloWorldUsername") ?? '',
                        //email: request.get<string>("HelloWorldEmail") ?? '',
                    }
                }
            },
            new BasicCliUseCaseOutputAdapter(),
        ),
        new BasicCliFailureResponseFormatter(),
    )
);

const ListHelloWorldCliRoute = new CliRoute({
        name: 'list',
        description: 'List HelloWorldModels',
        options: [
            { name: "skip", long: '--skip', short: '-s', type: 'number', min: 0, default: 0 },
            { name: "take", long: '--take', short: '-t', type: 'number', min: 1, default: 10 },
        ]
    },
    new BasicUseCaseExecutor(
        new ListHelloWorldUsecase(helloWorldService),
        new BasicUseCaseAdapter(
            (request: CliRequest): ListHelloWorldInput => {
                return {
                    offset: request.get<number>('skip')!,
                    limit: request.get<number>('take')!,
                }
            },
            new BasicCliUseCaseOutputAdapter(),
        ),
        new BasicCliFailureResponseFormatter(),
    )
);


export class HelloWorldCliRouter extends CliRouter {
    constructor() {
        super({
                name: 'helloworld',
                description: 'Manage HelloWorld'
            },
            CreateHelloWorldCliRoute,
            UpdateHelloWorldCliRoute,
            GetHelloWorldCliRoute,
            ListHelloWorldCliRoute
        )
    }
}