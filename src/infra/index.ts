/**
 * Expose here all services / repos
 */

// keeping here only for syntax 
import { MyService } from "@domain/services/MyService";
import { MyTechRepository } from "./tech/MyTechRepository";
export const myService = new MyService(new MyTechRepository());


import { HelloWorldService } from "@domain/services/HelloWorldService";
import { StaticHelloWorldRepository } from "./staticrepo/HelloWorldRepository";

export const helloWorldService = new HelloWorldService(
    new StaticHelloWorldRepository()
)