export const dbTableSql = [
    // prop
    `CREATE TABLE IF NOT EXISTS "prop"(
        "hidden" TINYINT,
        "id" CHAR(36) NOT NULL PRIMARY KEY,
        "hash" CHAR(32) UNIQUE,
        "table" VARCHAR,
        "key" VARCHAR,
        "value" VARCHAR
    )`,
    // user
    `CREATE TABLE IF NOT EXISTS "user"(
        "hidden" TINYINT,
        "id" CHAR(36) NOT NULL PRIMARY KEY,
        "phone" CHAR(11) UNIQUE NOT NULL,
        "name" VARCHAR NOT NULL,
        "password" CHAR(60),
        "salt" CHAR(36)
    )`,
    // orders
    `CREATE TABLE IF NOT EXISTS "orders"(
        "hidden" TINYINT,
        "id" CHAR(36) NOT NULL PRIMARY KEY,
        "client" VARCHAR,
        "img" CHAR(32),
        "note" TEXT,
        "editLine" TEXT,
        "timeCreate" INTEGER,
        "timeLast" INTEGER,
        "id_user" CHAR(36),
        "id_prop_state" CHAR(36),
        "count" INTEGER,
        "store" CHAR(2),
        "self" TINYINT
    )`,
    // "gjpId" CHAR(19),
    // client
    `CREATE TABLE IF NOT EXISTS "client"(
        "hidden" TINYINT,
        "id" CHAR(36) NOT NULL PRIMARY KEY,
        "name" VARCHAR UNIQUE NOT NULL,
        "pyfl" VARCHAR NOT NULL
    )`,
    // // paper
    // `CREATE TABLE IF NOT EXISTS "paper"(
    //     "hidden" TINYINT,
    //     "id" CHAR(36) NOT NULL PRIMARY KEY,
    //     "name" VARCHAR UNIQUE NOT NULL,
    //     "pyfl" VARCHAR NOT NULL
    // )`,
    // todo
    `CREATE TABLE IF NOT EXISTS "todo"(
        "hidden" TINYINT,
        "id" CHAR(36) NOT NULL PRIMARY KEY,
        "id_orders" CHAR(36),
        "index" TINYINT,
        "count" INTEGER,
        "state" VARCHAR
    )`,
    // commit
    `CREATE TABLE IF NOT EXISTS "commit"(
        "hidden" TINYINT,
        "id" CHAR(36) NOT NULL PRIMARY KEY,
        "id_todo" CHAR(36),
        "count" TINYINT,
        "img" CHAR(32),
        "timeCreate" INTEGER
    )`,
]