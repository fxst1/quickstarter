/**
 * Expose here all services / repos
 */

import { HelloWorldService } from "@domain-services/HelloWorldService";
import { StaticHelloWorldRepository } from "../infra/staticrepo/HelloWorldRepository";

export const helloWorldService = new HelloWorldService(
    new StaticHelloWorldRepository()
)