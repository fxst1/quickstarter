import { ExpressHttpApplication } from "@core-ext/http/express/HttpExpressApplication";
import { HelloWorldHttpRouter } from "./routes";

new ExpressHttpApplication(
    8080,
    new HelloWorldHttpRouter()
).run()