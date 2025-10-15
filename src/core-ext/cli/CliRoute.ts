import { CliResponse } from './CliResponse.js';
import { CliRequest } from './CliRequest.js';
import { CliRouteDescription } from './options/CliRouteDescription.js';
import { IUseCaseExecutor } from '@core-usecase/IUseCaseExecutor.js';
import { IRoute } from '@core/router/IRoute.js';
import { CliOption } from './options/CliOption.js';

export class CliRoute implements IRoute<CliRequest, CliResponse> {

    constructor(
        public readonly def: CliRouteDescription,
        protected usecaseExecutor: IUseCaseExecutor<CliRequest, CliResponse>,
    ) {
    }

    getUsecaseExecutor(): IUseCaseExecutor<CliRequest, CliResponse> {
        return this.usecaseExecutor;
    }

    getUsage(parentRouters: string[] = []): string {
        const cmdPath = [...parentRouters, this.def.name].join(' ');
        const options = (this.def.options ?? []).filter((o) => o.name).map(o => new CliOption(o));

        const usage = [
            `Usage: cli ${cmdPath} [options]`,
            '',
            this.def.description ? `Description:\n  ${this.def.description}` : '',
            '',
            'Options:',
            ...options.map(o => o.formatUsageLine()),
        ];

        return usage.join('\n').trim();
    }
}
