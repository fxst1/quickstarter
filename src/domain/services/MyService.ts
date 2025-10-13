//import { RootLogger } from "@core-ext/logging";
import { MyRepository } from "@domain/ports/MyRepository";

/**
 * MyService
 */
export class MyService {
    // private static readonly logger = RootLogger.instance.child({topic: 'MyTechRepository'});

    constructor(
        protected readonly repo: MyRepository
    ) {};

    doMyFunc() {
        // logger.debug('myfunc')
        this.repo.myFunc()
    }
}