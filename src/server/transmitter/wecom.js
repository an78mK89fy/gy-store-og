import axios from "axios"
import fs from 'node:fs'
import crypto from 'node:crypto'
import path from 'node:path'

const hooks = { og: {} }
try {
    hooks.og.baseURL = JSON.parse(process.env.SEV_WECOM_HOOKS_OG)[0]
    hooks.og.axios = axios.create({
        baseURL: hooks.og.baseURL, method: 'post', headers: { "Content-Type": 'application/json' }
    })
} catch (err) { console.log(err) }

export const wecom = {
    og: {
        img(config) {
            if (!hooks.og.baseURL) { return }
            try {
                const buffer = fs.readFileSync(path.join(import.meta.dirname, '../../../data/temp', config.img))
                const base64 = buffer.toString('base64')
                const md5 = crypto.createHash('md5').update(buffer).digest('hex')
                hooks.og.axios({ data: { msgtype: 'image', image: { base64, md5 } } })
            } catch (err) { console.log(err) }
        },
        news(config) {
            if (!hooks.og.baseURL) { return }
            hooks.og.axios({
                data: {
                    msgtype: "news",
                    news: {
                        articles: [
                            {
                                title: config.client,
                                description: config.type,
                                url: `http://${process.env.SEV_HOSTNAME}:${process.env.SEV_PORT}/`,
                                picurl: `http://${process.env.SEV_HOSTNAME}:${process.env.SEV_PORT}/upload/${config.img}`
                            }
                        ]
                    }
                }
            })
        }
    }
}