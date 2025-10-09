export type HelloWorldModel = {
    id: string,
    username: string,
    email: string
}

export type HelloWorldCreateModel = Omit<HelloWorldModel, 'id'>;
export type HelloWorldUpdateModel = Partial<Omit<HelloWorldModel, 'id'>>;