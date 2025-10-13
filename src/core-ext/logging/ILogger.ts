import { LogDispatcher } from "./ILogDispatcher";
import { LogLevel } from "./LogLevel";

export type LogContext = Record<string, unknown>;
export type LogData = Record<string, unknown> | undefined;


export interface ILogger {
	log(level: LogLevel, message: string, data?: LogData): void
    debug(msg: string, data?: LogData): void
    info(msg: string, data?: LogData): void
    warn(msg: string, data?: LogData): void
    error(msg: string, data?: LogData): void
    fatal(msg: string, data?: LogData): void
}

export interface IFactoryLoggerCapacity<Params extends LogContext = LogContext, LoggerType extends ILogger = ILogger> {
	child?(context: Params): LoggerType;
}

export abstract class BaseLogger implements ILogger {
	abstract log(level: LogLevel, message: string, data?: LogData): void;
	debug(msg: string, data?: LogData) { this.log(LogLevel.Debug, msg, data); }
    info(msg: string, data?: LogData) { this.log(LogLevel.Info, msg, data); }
    warn(msg: string, data?: LogData) { this.log(LogLevel.Warning, msg, data); }
    error(msg: string, data?: LogData) { this.log(LogLevel.Error, msg, data); }
    fatal(msg: string, data?: LogData) { this.log(LogLevel.Fatal, msg, data); }
}

export class BasicLogger extends BaseLogger implements IFactoryLoggerCapacity<LogContext & {topic?: string}, BasicLogger> {

    constructor(
		protected readonly topic: string,
		protected readonly dispatcher: LogDispatcher,
		protected readonly context: LogContext = {}
	) {
		super();
	}

    child(context: LogContext): BasicLogger {
		if (context.topic)
	    	return new BasicLogger(`${this.topic}:${context.topic}`, this.dispatcher, { ...this.context, ...context });
		return new BasicLogger(this.topic, this.dispatcher, { ... this.context, ...context })
    }

    log(level: LogLevel, message: string, data?: LogData) {
		this.dispatcher.dispatchLogEvent({
			timestamp: new Date(),
			level,
			topic: this.topic,
			message,
			data,
			context: this.context,
		});
    }
}
