import { ILogHandler } from "./ILogHandler";
import { ILogPipeline } from "./ILogPipeline";
import { LogEvent } from "./LogEvent";


export class LogDispatcher {
    private readonly handlers: Set<ILogHandler> = new Set();
    private readonly pipelines: ILogPipeline[] = [];

    addPipeline(logPipeline: ILogPipeline): LogDispatcher {
        this.pipelines.push(logPipeline);
        return this;
    }

    addHandler(logHandler: ILogHandler): LogDispatcher {
        this.handlers.add(logHandler);
        return this;
    }

    async dispatchLogEvent(logEvent: LogEvent): Promise<void> {
        let currentLogEvent: LogEvent | null = logEvent;

        for (const pipe of this.pipelines) {
            currentLogEvent = await pipe.processLogEvent(currentLogEvent);
            if (!currentLogEvent) return; // filtred
        }

        await Promise.all(Array.from(this.handlers).map(h => h.onLogEvent(logEvent)))
    }
}