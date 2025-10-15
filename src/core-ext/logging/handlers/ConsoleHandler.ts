import { ILogHandler } from "../ILogHandler";
import { LogEvent } from "../LogEvent";
import { LogLevel, logLevel2String } from "../LogLevel";

export class ConsoleHandler implements ILogHandler {
    protected readonly useColorSupport: boolean;
    constructor(useColorSupport?: boolean) {
        this.useColorSupport = useColorSupport ?? false;
    }

    private getLevelANSI(level: LogLevel): [string, string] {
        if (this.useColorSupport) {
            const reset = "\x1b[0m";
            switch (level) {
                case LogLevel.Debug:
                    return ["\x1b[90m", reset]

                case LogLevel.Info:
                    return ["\x1b[36m", reset]

                case LogLevel.Warning:
                    return ["\x1b[33m", reset];

                case LogLevel.Error:
                    return ["\x1b[31m", reset];

                case LogLevel.Fatal:
                    return ["\x1b[35m", reset];

                default:
                    return ["", ""]
            }
        } else {
            return ["", ""]
        }
    }

    private getConsoleLogger(level: LogLevel): (...data: unknown[]) => void {
        // Use default console.log for colors
        if (this.useColorSupport) return console.log;

        switch (level) {
            case LogLevel.Debug:
                return console.debug

            case LogLevel.Info:
                return console.info

            case LogLevel.Warning:
                return console.warn

            case LogLevel.Error:
                return console.error

            case LogLevel.Fatal:
                return console.error

            default:
                return console.log
        }
    }

    onLogEvent(logEvent: LogEvent): Promise<void> | void {
        const { level, topic, message, data } = logEvent;
        const [colorOn, colorOff] = this.getLevelANSI(level);
        const nodeConsoleHandler = this.getConsoleLogger(level);

        if (data !== undefined)
            nodeConsoleHandler(`${colorOn}[${logLevel2String(level)}] ${topic}: ${message}${colorOff}`, data);
        else
            nodeConsoleHandler(`${colorOn}[${logLevel2String(level)}] ${topic}: ${message}${colorOff}`);
    }

}
