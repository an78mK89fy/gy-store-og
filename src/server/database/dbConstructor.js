import path from 'node:path'
import crypto from 'node:crypto'
import sqlite3 from 'sqlite3'
import { dbTableSql } from './dbTableSql.js'

const db = new (sqlite3.verbose()).Database(path.join(import.meta.dirname, 'sqlite.db'))
await Promise.all(dbTableSql.map(sql => new Promise(resolve => db.run(sql, resolve))))

db.run( // 创建开发者账户
    process.env.NODE_ENV === 'production'
        ? 'DELETE FROM "user" WHERE "id"=?'
        : `INSERT OR IGNORE INTO "user"(
        "hidden","id","phone","name","password","salt"
        ) VALUES(0,?,'00000000000','Dev测试',null,null)`,
    ['00000000-0000-0000-0000-000000000000']
)

db.constructorPromise = (tableName) => new Promise(resolve => {
    const getHash = (string) => crypto.createHash('md5').update(string).digest('hex')
    // 查询表的所有列信息
    db.all(`PRAGMA table_info("${tableName}")`, (err, rows) => {
        const columnNames = rows.map(row => row.name) // 提取列名
        // 动态创建类
        class ConstructorDbDynamic {
            constructor(params) {
                // 将传入的数据映射到类的属性上
                columnNames.forEach(column => this[column] = params[column])
                this.hidden = params.hidden ? 1 : 0
                this.id = params.id || crypto.randomUUID()
            }
            static setPropPromise(key, values) {
                return Promise.all(
                    values.map(value => {
                        const hash = getHash(tableName + key + value)
                        return new Promise((resolve, reject) => {
                            db.run(
                                `INSERT OR IGNORE INTO "prop"(
                                    "hidden","id","hash","table","key","value"
                                ) VALUES(0,?,?,?,?,?)`,
                                [crypto.randomUUID(), hash, tableName, key, value],
                                err => err ? resolve(hash) : reject(err)
                            )
                        })
                    })
                )
            }
            static getPropPromise(key, value) {
                return new Promise((resolve, reject) => {
                    const sql = `SELECT * FROM "prop" WHERE "table"=? AND "KEY"=? AND "hidden"=0`
                    if (value) {
                        db.get(
                            sql + ' AND "value"=?', [tableName, key, value],
                            (err, row) => err ? reject(err) : resolve(row)
                        )
                    } else {
                        db.all(sql, [tableName, key], (err, rows) => err ? reject(err) : resolve(rows))
                    }
                })
            }
            static delPropPromise(key, value) {
                const hash = getHash(tableName + key + value)
                return new Promise((resolve, reject) => {
                    db.run(
                        `UPDATE "prop" SET "hidden"=1 WHERE "hash"=?`, [hash],
                        err => err ? reject(err) : resolve(hash)
                    )
                })
            }
            static findByIdPromise(id) {
                return new Promise((resolve, reject) => {
                    db.get(
                        `SELECT * FROM "${tableName}" WHERE "id"=?`,
                        [id], (err, row) => err ? reject(err) : resolve(row)
                    )
                })
            }
            static findByColumnPromise(columnName, cellsValue) {
                return new Promise((resolve, reject) => {
                    db.all(
                        `SELECT * FROM "${tableName}" WHERE "${columnName}"=?`,
                        [cellsValue], (err, rows) => err ? reject(err) : resolve(rows)
                    )
                })
            }
            static listPromise(hidden = 0, filters = '') {
                return new Promise((resolve, reject) => {
                    db.all(
                        `SELECT * FROM ${tableName} WHERE "hidden"=${hidden}${filters && ` AND (${filters})`}`,
                        (err, rows) => err ? reject(err) : resolve(rows)
                    )
                })
            }
            replaceIdPromise(id_table) {
                const _tableName = id_table.split('_')[1]
                return new Promise((resolve, reject) => {
                    db.get(
                        `SELECT * FROM "${_tableName}" WHERE "id"=?`,
                        [this[id_table]], (err, row) => {
                            if (err) { return reject(err) }
                            this[id_table] = row
                            resolve(row)
                        }
                    )
                })
            }
            savePromise() {
                return new Promise((resolve, reject) => {
                    if (this.id) {
                        db.get(`SELECT "id" FROM "${tableName}" WHERE "id"=?`, [this.id], (err, row) => {
                            if (err) { return reject(err) }
                            if (row) { //修改
                                function setValue(value) {
                                    const isNothing = value === undefined || value === null
                                    return isNothing ? null : `'${value}'`
                                }
                                const setCols = columnNames.map(column => `"${column}"=${setValue(this[column])}`).join()
                                db.run(
                                    `UPDATE "${tableName}" SET ${setCols} WHERE "id"=?`,
                                    [this.id], err => err ? reject(err) : resolve()
                                )
                            } else { //创建
                                const InsertCols = columnNames.map(column => `"${column}"`).join()
                                const InsertQ = Array(columnNames.length).fill('?').join()
                                db.run(
                                    `INSERT INTO ${tableName}(${InsertCols}) VALUES(${InsertQ})`,
                                    columnNames.map(column => this[column]),
                                    err => err ? reject(err) : resolve()
                                )
                            }
                        })
                    }
                })
            }
            deletePromise() {
                return new Promise((resolve, reject) => {
                    db.run(
                        `UPDATE "${tableName}" SET "hidden"=1 WHERE "id"=?`,
                        [this.id], err => err ? reject(err) : resolve()
                    )
                })
            }
        }

        // 返回动态创建的类
        resolve(ConstructorDbDynamic)
    })
})

export { db }