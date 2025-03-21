import axios from "axios"

const hooks = axios.create({ baseURL: JSON.parse(process.env.SEV_WECOM_HOOKS_OG)[0] })

export const wecom = function (config) {
    hooks({
        method: 'post',
        headers: { "Content-Type": 'application/json' },
        data: JSON.stringify({
            msgtype: "news",
            news: {
                articles: [
                    {
                        title: config.client,
                        description: config.type,
                        url: `http://${process.env.SEV_HOSTNAME}/`,
                        picurl: `http://${process.env.SEV_HOSTNAME}/upload/${config.img}`
                    }
                ]
            }
        })
    })
}