import 'dotenv/config'
import express from "express";
import path from 'node:path'
import multer from "multer";
import cookieParser from 'cookie-parser'
import ViteExpress from "vite-express";

import { mwOnlyHostname } from './middleware/mwOnlyHostname.js'
import { mwSafaFilters } from './middleware/mwSafaFilters.js'
import { api } from './api/api.js'

const app = express();

const dest = path.join(import.meta.dirname, '../../data/temp')
const upload = multer({ dest })

app.use(
  api.use(mwOnlyHostname),
  express.urlencoded({ extended: true }),
  express.json(),
  upload.any(),
  mwSafaFilters,
  cookieParser()
)

app.use('/upload', express.static(dest, { index: false }))
app.use('/api', api)

const port = process.env.SEV_PORT || 3000
ViteExpress.listen(app, port, () => console.log(
  `[ctrl] + [鼠标左键] 点击链接去管理用户 http://localhost:${port}/#/admin`
))