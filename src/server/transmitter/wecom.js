import axios from "axios"
import fs from 'node:fs'
import crypto from 'node:crypto'
import path from 'node:path'

const instance = axios.create({ headers: { "Content-Type": 'application/json' } })

export const wecom = {
    img(config) {
        if (!config.hooks) { return }
        const buffer = fs.readFileSync(path.join(import.meta.dirname, '../../../data/temp', config.img))
        const base64 = buffer.toString('base64')
        const md5 = crypto.createHash('md5').update(buffer).digest('hex')
        return instance.post(config.hooks, { msgtype: 'image', image: { base64, md5 } })
    },
    news(config) {
        if (!config.hooks) { return }
        return instance.post(config.hooks, {
            msgtype: "news",
            news: {
                articles: [
                    {
                        title: config.title,
                        description: config.description,
                        url: `http://${process.env.SEV_HOSTNAME}:${process.env.SEV_PORT}/${config.path || ''}`,
                        picurl: `http://${process.env.SEV_HOSTNAME}:${process.env.SEV_PORT}/upload/${config.img}`
                    }
                ]
            }
        })
    }
}