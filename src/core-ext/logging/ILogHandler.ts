import { LogEvent } from "./LogEvent";

export interface ILogHandler {
    onLogEvent(logEvent: LogEvent): Promise<void> | void;
}