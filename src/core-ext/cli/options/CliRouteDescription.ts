import { CliOptionDescription } from './CliOptionDescription';

export interface CliRouterDescription {
    name?: string;
    description?: string;
    options?: CliOptionDescription[];
    routes?: CliRouteDescription[]; // ✅ sous-routes (subcommands)
}

export interface CliRouteDescription extends CliRouterDescription{
    name: string,
    description?: string;
    options?: CliOptionDescription[];
    routes?: CliRouteDescription[]; // ✅ sous-routes (subcommands)
}