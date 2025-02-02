import express from 'express'

import { apiUser } from './apiUser.js'
import { apiAdmin } from './apiAdmin.js'
import { apiOrders } from './apiOrders.js'
import { mwVerifyAdmin } from '../middleware/mwVerifyAdmin.js'

const api = express.Router()

api.use('/admin', [mwVerifyAdmin, apiAdmin])

// 内判定token
api.use('/user', apiUser)
// 内判定token
api.use('/orders', apiOrders)

export { api }