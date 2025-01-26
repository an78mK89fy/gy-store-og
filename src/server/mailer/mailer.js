import fs from 'node:fs'
import path from 'node:path'
import nodemailer from 'nodemailer'

const transport = nodemailer.createTransport({
    host: "smtp.qq.com",
    port: 465,
    secure: true,
    auth: {
        user: "",
        pass: "",
    }
})

const templateCaptcha = fs.readFileSync(path.join(import.meta.dirname, 'template/captcha.html'), 'utf8')
transport.sendMail({
    from: `"国友纸业" <>`, // sender address
    to: "", // list of receivers
    subject: "Hello ✔", // Subject line
    html: templateCaptcha, // html body
}).then(e => console.log(e, '发成功')).catch(console.error)