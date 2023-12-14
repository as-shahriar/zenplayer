import sqlite, { Database } from 'better-sqlite3';
import path from 'path';
import { app } from 'electron';
import { DB_NAME } from '../constants/appConstants';
import { EntityModel } from '../models/EntityModel';
import { ProcessingItem } from '../models/ProcessingItem';
import { ProcessingItemStatus } from '../models/enums/ProcessingItemStatus';

const databasePath = path.join(app.getPath('userData'), DB_NAME);
export const db: Database = new sqlite(databasePath);
db.pragma('journal_mode = WAL');

db.exec(
    `CREATE TABLE IF NOT EXISTS folders
     (
         id       INTEGER PRIMARY KEY,
         name     TEXT,
         path     TEXT,
         parent   INTEGER DEFAULT -1,
         type     INTEGER,
         progress INTEGER DEFAULT 0,
         favorite INTEGER DEFAULT 0
     );`
);

db.exec(
    `CREATE TABLE IF NOT EXISTS processing_item
     (
         id       INTEGER PRIMARY KEY,
         status INTEGER,
         type INTEGER
     );`
);

export class Repository {
    private static instance: Repository;

    static getInstance = () => {
        if (Repository.instance) {
            return Repository.instance;
        }
        Repository.instance = new Repository();
        return Repository.instance;
    };

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

    addProcessingItem(id: number, type: number) {
        const stmt = db.prepare(
            `INSERT OR REPLACE INTO processing_item (id, status, type) VALUES (?, 0, ?)`
        );
        return stmt.run(id, type);
    }

    getAllProcessingItemsByStatusAndType(status: ProcessingItemStatus, type: number) {
        const stmt = db.prepare('SELECT * FROM processing_item where status = ? and type = ?');
        return stmt.all(status, type) as ProcessingItem[];
    }

    updateProcessingItem(id: number, status: number) {
        const stmt = db.prepare(`UPDATE processing_item SET status = ? WHERE id = ?`);
        return stmt.run(status, id);
    }

    updateFavorite(id: number, favorite: number) {
        const stmt = db.prepare(`UPDATE folders SET favorite = ? WHERE id = ?`);
        return stmt.run(favorite, id);
    }

    getAllFavorites() {
        const stmt = db.prepare('SELECT * FROM folders where favorite=1');
        return stmt.all() as ProcessingItem[];
    }

    deleteEntities(ids: number[]) {
        const stmt = db.prepare('DELETE FROM folders where id=?');
        for (const id of ids) {
            stmt.run(id);
        }
    }

    deleteProcessingItem = (id: number) => {
        const stmt = db.prepare('DELETE FROM processing_item where id=?');
        stmt.run(id);
    };
}
