"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultDB = {
    name: 'defaultDBConnection',
    type: 'sqlite',
    database: 'default.db',
    entities: [
        __dirname + '/../**/*.entity{.ts,.js}',
    ],
    synchronize: true,
    autoSchemaSync: true,
};
exports.testDB = {
    name: 'testDBConnection',
    type: 'sqlite',
    database: 'test.db',
    entities: [
        '../**/*.entity{.ts,.js}',
    ],
    synchronize: true,
    autoSchemaSync: true,
};
//# sourceMappingURL=database.js.map