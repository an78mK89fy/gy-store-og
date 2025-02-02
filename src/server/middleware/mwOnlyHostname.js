import express from 'express'

const mwOnlyHostname = express.Router()
mwOnlyHostname.use((req, res, next) => {
    if (!process.env.SEV_HOSTNAME || (req.hostname === process.env.SEV_HOSTNAME || 'localhost')) { next() }
})

export { mwOnlyHostname }