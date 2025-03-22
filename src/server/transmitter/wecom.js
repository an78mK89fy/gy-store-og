import axios from "axios"

const hooks = {}
try {
    hooks.og = axios.create({ baseURL: JSON.parse(process.env.SEV_WECOM_HOOKS_OG)[0] })
} catch (err) { console.log(err) }

export const wecom = {
    og(config) {
        if (!process.env.SEV_WECOM_HOOKS_OG.length) { return }
        hooks.og({
            method: 'post',
            headers: { "Content-Type": 'application/json' },
            data: JSON.stringify({
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
            })
        })
    }
}