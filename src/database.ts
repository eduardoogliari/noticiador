import { app } from 'electron';
const path = require('path');
const Database = require('better-sqlite3');

const dbPath = path.join(app.getPath('userData'), 'feeds.sqlite');
// const db = new Database(dbPath);
const db = new Database(':memory:');

db.prepare(`
  CREATE TABLE IF NOT EXISTS category (
    id      INTEGER   PRIMARY KEY,
    name    TEXT      NOT NULL
  )
`).run();

db.prepare(`
  CREATE TABLE IF NOT EXISTS subscription (
    id            INTEGER PRIMARY KEY,
    name          TEXT NOT NULL,
    url           TEXT NOT NULL UNIQUE,
    category_id   INTEGER,
    last_updated  DATETIME,
    favicon       BLOB,
    deleted_at    DATETIME,

    FOREIGN KEY (category_id) REFERENCES category(id)
  )
`).run();

db.prepare(`
  CREATE TABLE IF NOT EXISTS feed_item (
    id              INTEGER   PRIMARY KEY,
    sub_id          INTEGER   NOT NULL,
    title           TEXT      NOT NULL,
    url             TEXT      NOT NULL UNIQUE,
    comments_url    TEXT,
    pub_date        DATETIME,
    is_favorite     INTEGER   DEFAULT 0   CHECK(is_favorite IN (0, 1)),
    is_read         INTEGER   DEFAULT 0   CHECK(is_favorite IN (0, 1)),
    pending_removal INTEGER   DEFAULT 0   CHECK(is_favorite IN (0, 1)),

    FOREIGN KEY (sub_id) REFERENCES subscription(id) ON DELETE CASCADE
  )
`).run();

export default db;