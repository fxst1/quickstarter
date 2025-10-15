import { AnyRouteOrRouter, BaseRouter } from "@core-router/BaseRouter";
import { CliRequest } from "./CliRequest";
import { CliResponse } from "./CliResponse";
import { CliRouterDescription } from "./options/CliRouteDescription";
import { CliRoute } from "./CliRoute";
import { CliOption } from "./options/CliOption";
import { MissingRouteOrRouterCommandLineError } from "./errors";

export interface CliResolution {
    routerPath: string[];   // ex: ['foo', 'bar']
    route: CliRoute;        // la route finale identifiée
    rawArgs: string[];      // les arguments restants
    optionDefs: CliOption[]; // toutes les options fusionnées
}

export class CliRouter extends BaseRouter<CliRequest, CliResponse, CliRoute, CliRouter> {

    constructor(
        public readonly def: CliRouterDescription,
        ...routes: AnyRouteOrRouter<CliRequest, CliResponse, CliRoute, CliRouter>[]
    ) {
        super(...routes)
    }

    mountRoute(route: CliRoute): void {
        if (this.def.options) {
            if (!route.def.options)
                route.def.options = this.def.options;
            else
                route.def.options.push(...this.def.options )
        }
    }

    mountRouter(router: CliRouter): void {
        if (this.def.options) {
            if (!router.def.options)
                router.def.options = this.def.options;
            else
                router.def.options.push(...this.def.options )
        }
    }

    /**
     * Résout la route correspondante à partir des arguments CLI.
     * Exemple :
     *   ./app foo A --opt value
     */
    resolve(argv: string[], parentPath: string[] = []): CliResolution {
        const args = [...argv];
        const routerName = this.def.name;
        const routerOptions = this.def.options ?? [];

        // Si le router a un nom explicite, on consomme le token correspondant
        if (routerName && args[0] === routerName) {
            args.shift();
            parentPath = [...parentPath, routerName];
        }

        // Cherche la prochaine sous-route (token non-option)
        const token = args.find(a => !a.startsWith('-'));

        // Trouve le router/route enfant correspondant
        const child = this.getRoutesAndRouters().find(r =>
            r.def.name === token ||
            (!token && (!r.def.name || r.def.name === ''))
        );

        if (!child) {
            throw new MissingRouteOrRouterCommandLineError(token, parentPath, this);
        }

        // Si c’est un router, délègue la résolution
        if (child instanceof CliRouter) {
            const idx = args.indexOf(token!);
            if (idx !== -1) args.splice(idx, 1);
            const res = child.resolve(args, [...parentPath, child.def.name ?? '']);
            res.optionDefs.unshift(...routerOptions.map(o => new CliOption(o)));
            return res;
        }

        // Sinon, c’est une route terminale
        const idx = args.indexOf(token!);
        if (idx !== -1) args.splice(idx, 1);

        const mergedOptions = [...routerOptions, ...(child.def.options ?? [])].map(o => new CliOption(o));

        return {
            routerPath: [...parentPath, child.def.name ?? ''],
            route: child,
            optionDefs: mergedOptions,
            rawArgs: args,
        };
    }

    getUsage(parentRouters: string[] = []): string {
        const cmdPath = [...parentRouters, this.def.name].join(' ');
        const options = (this.def.options ?? []).filter((o) => o.name).map(o => new CliOption(o));

        const usage = [
            cmdPath.length ? `Usage: cli ${cmdPath} [options]` : `Usage: cli [options]`,
            '',
            this.def.description ? `Description:\n  ${this.def.description}` : '',
            '',
            'Options:',
            ...options.map(o => o.formatUsageLine()),
        ];

        const subRouters =  this.getRoutesAndRouters().filter(o => o.def.name);
        if (subRouters) {
            usage.push('', 'Sub Commandes:')
            subRouters.forEach((router) => {
                usage.push(
                    `\t${router.def.name ?? '(default)'}: ${router.def.description}`
                );
            })
        }

        return usage.join('\n').trim() + '\n';
    }
}