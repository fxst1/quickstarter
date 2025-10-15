import { BaseMiddleware } from "@core-router/BaseMiddleware";
import { Context } from "@core-router/Context";
import { HttpRequest } from "../HttpRequest";
import { HttpResponse } from "../HttpResponse";

export type HttpMiddlewareOptions = {
    responseHeaders: Record<string, string>;
}

export abstract class HttpMiddleware<AdditionalOptionType = object, RequiredData = unknown, NewData = RequiredData> extends BaseMiddleware<HttpRequest, HttpResponse, RequiredData, NewData> {
    protected readonly additionalResponseHeaders: Record<string, string> = {};
    constructor(
        protected readonly options: AdditionalOptionType & HttpMiddlewareOptions
    ) {
        super();
    }

    postHandle(_context: Context<HttpRequest, RequiredData & Partial<NewData>>, response: HttpResponse): HttpResponse {
        for (const prop in this.additionalResponseHeaders)
            response.headers[prop] = this.additionalResponseHeaders[prop];
        return response
    }

}