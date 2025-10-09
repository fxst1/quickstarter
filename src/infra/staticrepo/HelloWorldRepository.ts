import { HelloWorldCreateModel, HelloWorldModel, HelloWorldUpdateModel } from "@domain-models/HelloWorld";
import { StaticRepoWithStringPrimaryKey } from "./BaseStaticRepo";
import { HelloWorldRepository } from "@domain-ports/HelloWorldRepository";

export class StaticHelloWorldRepository extends StaticRepoWithStringPrimaryKey<HelloWorldModel> implements HelloWorldRepository {

    listModels(startOffset: number, endOffset: number): HelloWorldModel[] {
        return Array.from(this.collection.values().drop(startOffset).take(endOffset - startOffset))
    }

    isUsernameUsed(username: string, currentId?: string): boolean {
        for (const [_, mdl] of this.collection) {
            if (currentId && currentId === mdl.id) continue;
            if (username === mdl.username) return true;
        }
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