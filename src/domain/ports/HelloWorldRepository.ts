import { HelloWorldCreateModel, HelloWorldModel, HelloWorldUpdateModel } from "@domain-models/HelloWorld"

export interface HelloWorldRepository {
    isUsernameUsed(username: string, currentId?: string): Promise<boolean> | boolean;
    createModel(creationModel: HelloWorldCreateModel): string | Promise<string>;
    getModel(id: string): HelloWorldModel | Promise<HelloWorldModel|null> | null;
    updateModel(id: string, updates: HelloWorldUpdateModel): void | Promise<void>;
    listModels(startOffset: number, endOffset: number): HelloWorldModel[] | Promise<HelloWorldModel[]>;
}