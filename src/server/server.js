import 'dotenv/config'
import express from "express";
import path from 'node:path'
import multer from "multer";
import cookieParser from 'cookie-parser'
import ViteExpress from "vite-express";

import { api } from './api/api.js'

const app = express();

const dest = path.join(import.meta.dirname, './database/temp')
const upload = multer({ dest })

app.use(
  express.urlencoded({ extended: true }),
  express.json(),
  upload.any(),
  cookieParser()
)

app.use('/upload', express.static(dest))
app.use('/api', api)

ViteExpress.listen(app, process.env.SEV_PORT, () => console.log(
  `[ctrl] + [鼠标左键] 点击链接去管理用户 http://localhost:${process.env.SEV_PORT}/#/admin`
))