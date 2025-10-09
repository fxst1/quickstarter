export class HttpResponse {
    readonly status: number
    readonly body: unknown
    readonly headers: Record<string, string>

    constructor(options: {
        readonly status: number
        readonly body?: unknown
        readonly headers?: Record<string, string>
    }) {
        this.status = options.status
        this.body = options.body
        this.headers = options.headers ?? {}
    }

    static initEmpty(): HttpResponse {
        return new HttpResponse({
            status: 204,
        })
    }

    static intoJson(data: unknown): HttpResponse {
        return new HttpResponse({
            status: 200,
            body: data,
            headers: {
                'Content-Type': 'application/json',
            }
        })
    }
}
