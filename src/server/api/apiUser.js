import express from 'express'

import { User } from '../constructor/user.js'

const apiUser = express.Router()

apiUser.post('/login', User.login)
apiUser.delete('/logout', User.logout)
// apiUser.get('/forget', (req, res) => {
//     User.findByColumnPromise('phone', '13587807370').then(rows => {
//         const user = new User(rows[0])
//         const lightPswd = user.forget()
//         user.savePromise().then(() => {
//             console.log(lightPswd)
//             res.end()
//         }).catch(err => {
//             console.log(err)
//         })
//     })
// })


export { apiUser }