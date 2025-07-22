import { app } from 'electron';
const path = require('path');
const Database = require('better-sqlite3');

const dbPath = path.join(app.getPath('userData'), 'feeds.sqlite');
// const db = new Database(dbPath);
const db = new Database(':memory:');

db.prepare(`
  CREATE TABLE IF NOT EXISTS subscription (
    id            INTEGER PRIMARY KEY,
    name          TEXT NOT NULL,
    url           TEXT NOT NULL UNIQUE,
    last_updated  TEXT,
    favicon       BLOB
  )
`).run();

db.prepare(`
  CREATE TABLE IF NOT EXISTS feed_item (
    id      INTEGER PRIMARY KEY,
    sub_id  INTEGER NOT NULL,
    title   TEXT NOT NULL,
    url     TEXT NOT NULL UNIQUE,
    pub_date TEXT,
    FOREIGN KEY (sub_id) REFERENCES subscription(id) ON DELETE CASCADE
  )
`).run();

export default db;