import { LogEvent } from "./LogEvent";

export interface ILogPipeline {
    processLogEvent(event: LogEvent): LogEvent | null | Promise<LogEvent | null>;
}