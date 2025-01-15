import path from 'node:path'
import express from "express";
import ViteExpress from "vite-express";

import { api } from './api/indexApi.js'
import multer from "multer";

const app = express();

const dest = path.join(import.meta.dirname, './database/temp')
const upload = multer({ dest })

app.use(
  express.urlencoded({ extended: true }),
  express.json(),
  upload.any()
)

app.use('/upload', express.static(dest))

app.use('/api', api)

ViteExpress.listen(app, 3000, () =>
  console.log("Server is listening on port 3000..."),
);
