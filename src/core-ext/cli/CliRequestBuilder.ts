import { CliRequest } from "./CliRequest";
import { CliResolution } from "./CliRouter";
import { UnexpectedOptionCommandLineError } from "./errors";

export class CliRequestBuilder {
    static fromResolution(resolution: CliResolution): CliRequest {
        const { route, optionDefs, rawArgs } = resolution;
        const values: Record<string, unknown> = {};
        const rest: string[] = [];

        const argv = [...rawArgs];
        let i = 0;
        while (i < argv.length) {
            const arg = argv[i];

            if (!arg.startsWith("-")) {
                rest.push(arg);
                i++;
                continue;
            }

            const eqIndex = arg.indexOf("=");
            let name = arg;
            let rawValue: string | true = true;

            if (eqIndex !== -1) {
                name = arg.slice(0, eqIndex);
                rawValue = arg.slice(eqIndex + 1);
            }

            const opt = optionDefs.find(o => o.matches(name));
            if (!opt) {
                throw new UnexpectedOptionCommandLineError(name, resolution.route);
            }

            // Gestion du format `--opt value`
            if (rawValue === true && i + 1 < argv.length && !argv[i + 1].startsWith("-")) {
                rawValue = argv[++i];
            }

            const parsed = opt.parseValue(rawValue);
            values[opt.def.name] = parsed;

            i++;
        }

        // Appliquer les valeurs par défaut
        for (const opt of optionDefs) {
            if (values[opt.def.name] === undefined && opt.def.default !== undefined) {
                values[opt.def.name] = opt.def.default;
            }
        }

        return new CliRequest(route, values, rest, rawArgs);
    }
}