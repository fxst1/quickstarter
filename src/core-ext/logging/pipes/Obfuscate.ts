import { LogData } from "../ILogger";
import { ILogPipeline } from "../ILogPipeline";
import { LogEvent } from "../LogEvent";

export abstract class BaseObfuscate implements ILogPipeline {
    constructor(
        private readonly patterns: (RegExp | string)[],
    ) {}

    processLogEvent(logEvent: LogEvent): LogEvent {
        return {
            ...logEvent,
            message: this.obfuscateValue(logEvent.message) as string,
            data: this.deepObfuscate(logEvent.data),
            context: this.deepObfuscate(logEvent.context),
        };
    }

    protected abstract replace(old: string): string;

    protected obfuscateValue(value: unknown): unknown {
        if (typeof value !== "string") return value;

        let result = value;
        for (const pattern of this.patterns) {
            if (pattern instanceof RegExp) {
                result = result.replace(pattern, this.replace(value));
            } else if (typeof pattern === "string" && result.includes(pattern)) {
                result = result.split(pattern).join(this.replace(value));
            }
        }
        return result;
    }

    private deepObfuscate(obj?: Record<string, unknown>): Record<string, unknown> | undefined {
        if (!obj) return obj;

        const result: Record<string, unknown> = {};

        for (const [key, value] of Object.entries(obj)) {
            const obfuscatedKey = this.obfuscateValue(key) as string;
            const obfuscatedValue =
            typeof value === "object" && value !== null
            ? this.deepObfuscate(value as LogData)
            : this.obfuscateValue(value);

            result[obfuscatedKey] = obfuscatedValue;
        }

        return result;
    }
}

export class BasicObfuscate extends BaseObfuscate {
    constructor(
        protected readonly replacement: string = "[REDACTED]",
        ...patterns: (RegExp | string)[]
    ) {
        super(patterns)
    }

    protected replace(_old: string): string {
        return this.replacement;
    }

}