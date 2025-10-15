import { CliRoute } from "./CliRoute";

export class CliRequest {
    params: unknown;
    constructor(
        public readonly route: CliRoute,
        public readonly values: Record<string, unknown>,
        public readonly rest: string[],
        public readonly rawArgs: string[],
    ) {}

    /**
     * Retourne la valeur d’une option typée
     */
    get<T>(optionName: string): T | undefined {
        return this.values[optionName] as T;
    }
}
