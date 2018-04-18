export const defaultDB = {
    name: 'defaultDBConnection',
    type: 'sqlite',
    database: 'default.db',
    entities: [
        __dirname + '/../**/*.entity{.ts,.js}',
    ],
    synchronize: true,
    autoSchemaSync: true,
};

export const testDB = {
    name: 'testDBConnection',
    type: 'sqlite',
    database: 'test.db',
    entities: [
        '../**/*.entity{.ts,.js}',
    ],
    synchronize: true,
    autoSchemaSync: true,
};