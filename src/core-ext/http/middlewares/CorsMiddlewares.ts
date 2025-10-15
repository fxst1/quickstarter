import { Context } from "@core-router/Context";
import { HttpMiddleware } from "./HttpMiddleware";
import { HttpRequest } from "../HttpRequest";
import { HttpResponse } from "../HttpResponse";

export type CORSOptions = {
    origin?: string[];
    methods?: string[];
    allowedHeaders?: string[];
    exposedHeaders?: string[];
    credentials?: boolean;
    maxAge?: number;
};

export type CORSMiddlewareData = {
    corsHeaders: Record<string, string>;
};

export class CORSMiddleware extends HttpMiddleware<CORSOptions> {

    protected override preHandle?(context: Context<HttpRequest, unknown>): HttpResponse | void {
        if (this.options.origin) {
            this.additionalResponseHeaders['Access-Control-Allow-Origin'] = this.options.origin.join(',')
        } else {
            this.additionalResponseHeaders['Access-Control-Allow-Origin'] = '*';
        }

        if (this.options.credentials) {
            this.additionalResponseHeaders['Access-Control-Allow-Credentials'] = 'true';
        }

        if (this.options.methods) {
            this.additionalResponseHeaders['Access-Control-Allow-Methods'] = this.options.methods.join(',');
        } else {
            this.additionalResponseHeaders['Access-Control-Allow-Methods'] = '*';
        }

        if (this.options.allowedHeaders) {
            this.additionalResponseHeaders['Access-Control-Allow-Headers'] = this.options.allowedHeaders.join(',');
        }

        if (this.options.maxAge) {
            this.additionalResponseHeaders['Access-Control-Max-Age'] = this.options.maxAge.toString();
        }

        if (this.options.exposedHeaders) {
            this.additionalResponseHeaders['Access-Control-Expose-Headers'] = this.options.exposedHeaders.join(',');
        }

        if (context.request.method === 'OPTIONS') return HttpResponse.initEmpty();
    }
}