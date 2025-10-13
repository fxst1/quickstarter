import { appendFileSync } from "fs";
import { ILogHandler } from "../ILogHandler";
import { LogEvent } from "../LogEvent";

export class FileHandler implements ILogHandler {
    constructor(private readonly filePath: string) {}

    onLogEvent(logEvent: LogEvent): Promise<void> | void {
        const line = JSON.stringify(logEvent) + "\n";
        appendFileSync(this.filePath, line);
    }
}