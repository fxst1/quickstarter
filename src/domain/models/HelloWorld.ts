export type HelloWorldModel = {
    id: string,
    username: string,
}

export type HelloWorldCreateModel = Omit<HelloWorldModel, 'id'>;
export type HelloWorldUpdateModel = Partial<Omit<HelloWorldModel, 'id'>>;