import { LogContext } from "../ILogger";
import { ILogPipeline } from "../ILogPipeline";
import { LogEvent } from "../LogEvent";

export type EnricherContextFunction = () => LogContext;
export class Enricher implements ILogPipeline {
    constructor(
        protected readonly mergeFunction: EnricherContextFunction
    ) {}

    processLogEvent(event: LogEvent): LogEvent | null | Promise<LogEvent | null> {
        return {
            ...event,
            context: { ...event.context, host: process.env.HOSTNAME, pid: process.pid }
        }
    }

}