import { CliRequest } from "@core-ext/cli/CliRequest";
import { CliResponse } from "@core-ext/cli/CliResponse";
import { CliRoute } from "@core-ext/cli/CliRoute";
import { CliRouter } from "@core-ext/cli/CliRouter";
import { IApplication } from "@core/application/IApplication";
import { AnyRouteOrRouter } from "@core/router/BaseRouter";
import { CliRequestBuilder } from "@core-ext/cli/CliRequestBuilder";
import { CliRouterDescription } from "./options/CliRouteDescription";
import { CommandLineError, MissingRouteOrRouterCommandLineError } from "./errors";
import { CliOptionDescription } from "./options/CliOptionDescription";
import { argv } from "node:process";

export interface CliApplicationDescription {
    run: 'loop' | 'single' | 'stdin',
    ignoreArgc?: number
    name: undefined,
    options?: CliOptionDescription[]
}

export class CliApplication extends CliRouter implements IApplication {

    protected readonly applicationDescription: CliApplicationDescription;
    constructor(
        def: CliApplicationDescription & CliRouterDescription,
        ...routes: AnyRouteOrRouter<CliRequest, CliResponse, CliRoute, CliRouter>[]
    ) {
        super(def, ...routes);
        this.applicationDescription = def
        this.notify();
    }

    run(): Promise<void> | void {
        switch (this.applicationDescription.run) {
            case "loop": return this.runForever();
            case "single": return this.runSingleCommand();
            case "stdin": return this.runStdin();
        }
        throw new Error("Method not implemented.");
    }


    private async onRequest(args: string[]): Promise<void> {
        try {
            const resolution = this.resolve(args);
            const request = CliRequestBuilder.fromResolution(resolution);
            if (request.get<boolean>('Help')) {
                console.log(request.route.getUsage());
            } else {
                const response = await resolution.route.getUsecaseExecutor().executeUsecase(request);
                if (response) response.dump();
            }
        } catch (e) {
            if (e instanceof CommandLineError) {
                console.log(e.getUsage());
            }

            if (!(e instanceof MissingRouteOrRouterCommandLineError))
                throw e;
        }
    }

    private runForever(): void {
        throw new Error('Unsupported run forever');
    }

    private runSingleCommand(): void | Promise<void> {
        argv.splice(0, this.applicationDescription.ignoreArgc ?? 2);
        return this.onRequest(argv);
    }

    private runStdin(): void {
        throw new Error('Unsupported run forever');
    }

}