import { BaseAppError } from "@core/errors";
import { CliRoute } from "../CliRoute";
import { CliRouter } from "../CliRouter";

export class CommandLineError extends BaseAppError {
    constructor(
        codeValue: number,
        codeName: string,
        routerOrRoute: CliRoute | CliRouter
    ) {
        super(codeValue, codeName, routerOrRoute);
    }

    getUsage(): string {
        return this.detail.getUsage();
    }
}

export class MissingRouteOrRouterCommandLineError extends CommandLineError {
    constructor(
        token: string | undefined,
        parentPaths: string[], 
        routerOrRoute: CliRoute | CliRouter
    ) {
        super(400, `Unknown route or router: ${token ?? '(default)'}: ${parentPaths}`, routerOrRoute)
    }
}

export class UnexpectedOptionCommandLineError extends CommandLineError {
    constructor(
        token: string,
        routerOrRoute: CliRoute | CliRouter
    ) {
        super(400, `Unknown option: ${token}`, routerOrRoute)
    }
}
