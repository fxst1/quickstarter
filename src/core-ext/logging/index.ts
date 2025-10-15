import { ConsoleHandler } from "./handlers/ConsoleHandler";
import { LogDispatcher } from "./ILogDispatcher";
import { BasicLogger, IFactoryLoggerCapacity } from "./ILogger";
import { LogLevel } from "./LogLevel";
import { LevelFilter } from "./pipes/LevelFilter";

export class RootLogger implements IFactoryLoggerCapacity<{topic: string}, BasicLogger> {
    static readonly instance: RootLogger = new RootLogger();

    private readonly topics: Map<string, BasicLogger> = new Map();
    private readonly dispatcher: LogDispatcher;

    private constructor() {
        this.dispatcher = new LogDispatcher()
                .addHandler(new ConsoleHandler(true))
                .addPipeline(new LevelFilter(LogLevel.Debug));
    }

    child(context: {topic: string}): BasicLogger {
        const cached = this.topics.get(context.topic);
        if (cached) return cached;
        
        const item = this.createLogger(context.topic);
        this.topics.set(context.topic, item);
        return item;
    }

    private createLogger(topic: string): BasicLogger {
        return new BasicLogger(
            topic,
            this.dispatcher
        );
    }
}