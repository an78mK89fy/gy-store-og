import { db } from '../database/dbConstructor.js'

class Commit extends (await db.constructorPromise('commit')) {
    constructor(params) {
        super(params)
    }
}

export { Commit }