import express from 'express'

import { mwVerifyAdmin } from '../middleware/mwVerifyAdmin.js'
import { mwVerifyToken } from '../middleware/mwVerifyToken.js'
import { apiAdmin } from './apiAdmin.js'
import { apiUser } from './apiUser.js'
import { apiOrders } from './apiOrders.js'
import { apiClient } from './apiClient.js'
import { apiPaper } from './apiPaper.js'

const api = express.Router()

api.use('/admin', [mwVerifyAdmin, apiAdmin])

// 内判定token
api.use('/user', apiUser)

apiUser.use(mwVerifyToken)
api.use('/orders', apiOrders)
api.use('/client', apiClient)
api.use('/paper', apiPaper)

export { api }