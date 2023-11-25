import sqlite, { Database } from 'better-sqlite3';
import path from 'path';
import { app } from 'electron';
import { DB_NAME } from '../constants/appConstants';
import { EntityModel } from '../models/EntityModel';

const databasePath = path.join(app.getPath('userData'), DB_NAME);
export const db: Database = new sqlite(databasePath);

db.exec(
    `CREATE TABLE IF NOT EXISTS folders
     (
         id       INTEGER PRIMARY KEY,
         name     TEXT,
         path     TEXT,
         parent   INTEGER DEFAULT -1,
         type     INTEGER,
         progress INTEGER DEFAULT 0
     );`
);

export class Repository {
    findById(id: number) {
        const stmt = db.prepare(`select * from folders where id = ?`);
        return stmt.get(id) as EntityModel;
    }

    findAll() {
        return db.prepare(`select * from folders where 1;`).all() as EntityModel[];
    }

    findAllRoot() {
        return db.prepare(`select * from folders where parent=-1;`).all() as EntityModel[];
    }

    findChildren(parentId: number) {
        return db.prepare(`select * from folders where parent=${parentId};`).all() as EntityModel[];
    }

    insert(entity: EntityModel) {
        const stmt = db.prepare(
            `INSERT INTO folders (name, path, parent, type) VALUES (?, ?, ?, ?);`
        );
        const { name, path, parent, type } = entity;
        return stmt.run(name, path, parent, type);
    }

    updateProgress(id: number, progress: number) {
        const stmt = db.prepare(`UPDATE folders SET progress = ? WHERE id = ?`);
        return stmt.run(progress, id);
    }
}
