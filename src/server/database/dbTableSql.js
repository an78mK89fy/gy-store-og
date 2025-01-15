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
        "account" VARCHAR(255),
        "password" CHAR(60),
        "name" VARCHAR
    )`,
    // orders
    `CREATE TABLE IF NOT EXISTS "orders"(
        "hidden" TINYINT,
        "id" CHAR(32) NOT NULL PRIMARY KEY,
        "gjpId" CHAR(19),
        "id_prop_type" CHAR(32),
        "note" TEXT,
        "timeCreate" INTEGER,
        "timeLast" INTEGER,
        "id_prop_state" CHAR(32)
    )`,
]