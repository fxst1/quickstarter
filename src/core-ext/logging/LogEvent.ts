import { LogLevel } from "./LogLevel";

export interface LogEvent {
    timestamp: Date;
    level: LogLevel;
    topic: string;
    message: string;
    data?: Record<string, unknown>;
    context?: Record<string, unknown>;
}