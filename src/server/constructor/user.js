import bcrypt from 'bcrypt'

import { db } from '../database/dbConstructor.js'

class User extends (await db.constructorPromise('user')) {
    /**
    * @param {object} params
    * @param {string} params.id
    * @param {string} params.phone
    * @param {string} params.name
    * @param {string} params.email
    * @param {string} params.password
    * @param {string} params.salt
    */
    constructor(params) {
        super(params)
    }
    static bcrypt(pswd) { return bcrypt.hashSync(pswd, 10) }
    static create(params) {
        const user = new User(params)
        return { user, lightPswd: user.forget() }
    }
    forget() {
        const lightPswd = parseInt(Date.now() * Math.random()).toString(16)
        this.password = User.bcrypt(lightPswd)
        this.salt = undefined
        return lightPswd
    }
    verify(pswd) {
        bcrypt.compareSync(pswd, result?.password || '')
        return
    }
    desensitization() {
        this.hidden = undefined
        this.password = undefined
        this.salt = undefined
        return this
    }
    delete() { this.hidden = 1; this.phone = Date.now() }
    reback(phone) {
        this.phone = phone
        this.hidden = 0
        return this.forget()
    }
}

export { User }