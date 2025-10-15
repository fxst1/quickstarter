import { ILogPipeline } from "../ILogPipeline";
import { LogEvent } from "../LogEvent";
import { LogLevel } from "../LogLevel";

export class LevelFilter implements ILogPipeline {
    constructor(protected readonly minLevel: LogLevel) {}

    processLogEvent(logEvent: LogEvent): LogEvent | null {
        if (logEvent.level < this.minLevel) return null
        return logEvent;
    }
}