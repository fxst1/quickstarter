export enum LogLevel {
	Debug,
	Info,
	Warning,
	Error,
	Fatal
}

export function logLevel2String(logLevel: LogLevel): string {
	switch (logLevel) {
		case LogLevel.Debug:
			return "DEBUG";

		case LogLevel.Info:
			return "INFO";

		case LogLevel.Warning:
			return "WARNING";

		case LogLevel.Error:
			return "ERROR";

		case LogLevel.Fatal:
			return "FATAL";
	}
}