import { HelloWorldCreateModel, HelloWorldModel, HelloWorldUpdateModel } from "@domain-models/HelloWorld";
import { StaticRepoWithStringPrimaryKey } from "./BaseStaticRepo";
import { HelloWorldRepository } from "@domain-ports/HelloWorldRepository";
import { RootLogger } from "@core-ext/logging";
import { ILogger } from "@core-ext/logging/ILogger";

export class StaticHelloWorldRepository extends StaticRepoWithStringPrimaryKey<HelloWorldModel> implements HelloWorldRepository {

    static logger: ILogger = RootLogger.instance.child({ topic: 'StaticHelloWorldRepository' });
    constructor() {
        super('.myrepo.json');
    }

    listModels(startOffset: number, endOffset: number): HelloWorldModel[] {
        StaticHelloWorldRepository.logger.info('listModel', { startOffset, endOffset });
        StaticHelloWorldRepository.logger.debug(`drop ${startOffset}, take ${endOffset - startOffset}`);

        return Array.from(this.collection.values().drop(startOffset).take(endOffset - startOffset))
    }

    isUsernameUsed(username: string, currentId?: string): boolean {
        StaticHelloWorldRepository.logger.info('isUsernameUsed', { username, currentId });

        for (const [_, mdl] of this.collection) {
            if (currentId && currentId === mdl.id) continue;
            if (username === mdl.username) {
                StaticHelloWorldRepository.logger.warn(`Username ${username} used by ${mdl.id}`, {currentId});
                return true;
            }
        }

        StaticHelloWorldRepository.logger.debug(`Username ${username} is not used`, {currentId});
        return false
    }

    createModel(creationModel: HelloWorldCreateModel): string {
        const id = this.generateNewPrimaryKey();
        this.set(id, {
            id: id,
            ...creationModel
        })
        return id;
    }

    getModel(id: string): HelloWorldModel | null {
        return this.get(id)
    }

    updateModel(id: string, updates: HelloWorldUpdateModel): void {
        const item = this.get(id);
        if (item) {
            this.set(id, {
                ...item,
                ...updates
            })
        }
    }

}