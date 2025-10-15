import { CliOptionDescription } from './CliOptionDescription';

export class CliOption<T = unknown> {
    constructor(public readonly def: CliOptionDescription<T>) {}

    formatUsageLine(): string {
        const parts: string[] = [];

        if (this.def.short) parts.push(this.def.short);
        if (this.def.long) parts.push(this.def.long);

        const display = parts.join(', ') || this.def.name;

        const typeHint =
            this.def.type && this.def.type !== 'boolean'
                ? ` <${this.def.type}>`
                : '';

        const range =
            this.def.type === 'number'
                ? [
                      this.def.min !== undefined ? `min: ${this.def.min}` : null,
                      this.def.max !== undefined ? `max: ${this.def.max}` : null,
                  ]
                      .filter(Boolean)
                      .join(', ')
                : undefined;

        const choices =
            this.def.choices && this.def.choices.length
                ? `choices: ${this.def.choices.join(', ')}`
                : undefined;

        const defaultVal =
            this.def.default !== undefined
                ? `default: ${JSON.stringify(this.def.default)}`
                : undefined;

        const constraints = [range, choices, defaultVal]
            .filter(Boolean)
            .join('; ');

        const description = this.def.description
            ? ` - ${this.def.description}`
            : '';

        return `  ${display}${typeHint}${description}${
            constraints ? ` (${constraints})` : ''
        }`;
    }

    matches(clean: string): boolean {
        return (
            clean === this.def.short ||
            clean === this.def.long
        );
    }

    private parseBooleanValue(input: string | true): boolean {
        return input === true || input === 'true';
    }

    private parseNumberValue(input: string | true): number {
        const value = (Number(input) as number);
        if (isNaN(value)) throw new Error(`Invalid number for --${this.def.name}`);
        if (this.def.min !== undefined && value < this.def.min)
            throw new Error(`${this.def.name} must be >= ${this.def.min}`);
        if (this.def.max !== undefined && value > this.def.max)
            throw new Error(`${this.def.name} must be <= ${this.def.max}`);
        return value;
    }

    private parseStringValue(input: string | true): string {
        const value = String(input);
        if (this.def.regex && !this.def.regex.test(value))
            throw new Error(`--${this.def.name} does not match required format`);
        return value;
    }


    parseValue(input: string | true): T {
        const def = this.def;
        if (def.parse) return def.parse(input);

        let value: unknown;
        switch (def.type) {
            case 'boolean': {
                value = this.parseBooleanValue(input);
                break;
            }

            case 'number': {
                value = this.parseNumberValue(input);
                break;
            }

            case 'string':
            default:
                value = this.parseStringValue(input);
                break;
        }

        if (def.choices && !def.choices.includes(value as T))
            throw new Error(`--${def.name} must be one of: ${def.choices.join(', ')}`);
        return value as T;
    }

    /*
    accumulateValue(existing: T | undefined, newValue: T): T {
        if (!this.def.accumulate) return newValue;
        if (typeof newValue === 'boolean') {
            return (existing as number || 0) + 1 as T;
        }
        if (typeof newValue === 'number') {
            return ((existing ?? 0) + newValue);
        }
        return (existing ? `${existing},${newValue}` : newValue) as any;
    }
    */
}
