import express from 'express'

const mwVerifyAdmin = express.Router()
mwVerifyAdmin.use((req, res, next) => { if (req.hostname === 'localhost') { next() } })

export { mwVerifyAdmin }