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
        "id" CHAR(32) NOT NULL PRIMARY KEY,
        "note" TEXT,
        "timeCreate" INTEGER,
        "timeLast" INTEGER,
        "id_prop_state" CHAR(36),
        "id_client" CHAR(36)
    )`,
    // "gjpId" CHAR(19),
    // client
    `CREATE TABLE IF NOT EXISTS "client"(
        "hidden" TINYINT,
        "id" CHAR(32) NOT NULL PRIMARY KEY,
        "name" VARCHAR UNIQUE NOT NULL,
        "pyfl" VARCHAR NOT NULL
    )`
]