import { HttpRouteMethods } from "./HttpRoute";

export interface BodyReader {
    text(): Promise<string>,
    json(): Promise<unknown>,
}

export class HeaderValue extends Array<string> {
    override toString(): string {
        if (this.length === 1) return this.at(0)!.toString();
        return super.toString();
    }

    static arrayFromHeaderRecords(headers: Record<string, string | string[]>) {
        const record: Record<string, HeaderValue> = {};
        for (const headerKey in headers) {
            const headerVal = headers[headerKey];

            record[headerKey] = new HeaderValue();
            if (typeof headerVal === 'string') {
                record[headerVal].push(headerVal)
            } else {
                record[headerKey].push(...headerVal)
            }
        }
        return record
    }
}

export class HttpRequest {
    readonly method: HttpRouteMethods
    readonly headers: Record<string, HeaderValue>
    readonly url: URL;
    readonly params: Record<string, string>;
    readonly bodyReader?: BodyReader

    constructor(options: {
        readonly method: HttpRouteMethods
        readonly url: URL,
        readonly params: Record<string, string>;
        readonly headers?: Record<string, string | string[]>,
        readonly bodyReader?: BodyReader
    }) {
        this.method = options.method;
        this.url = options.url;
        this.headers = HeaderValue.arrayFromHeaderRecords(options.headers ?? {})
        this.bodyReader = options.bodyReader
        this.params = options.params;
    }

    async json(): Promise<unknown> {
        const tmp = this.bodyReader?.json();
        console.log(">", tmp);
        return tmp ?? {}
    }

    async text(): Promise<string> {
        if (this.bodyReader)
            return this.bodyReader.text();
        return '';
    }


    static async fromFetchRequest(request: Request): Promise<HttpRequest> {
        const url = new URL(request.url);
        const headers: Record<string, string> = {};

        request.headers.keys().forEach((headerKey: string) => {
            headers[headerKey] = request.headers.get(headerKey) ?? ''
        })

        return new HttpRequest({
            method: request.method as HttpRouteMethods,
            url: url,
            headers: headers,
            bodyReader: request,
            params: {}
        });
    }
}
