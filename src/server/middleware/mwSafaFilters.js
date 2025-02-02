import path from 'node:path'
import fs from 'node:fs'
import express from 'express'

const mwSafaFilters = express.Router()
mwSafaFilters.use((req, res, next) => {
    if (req.files?.length) {
        let errorFiles = []
        req.files.forEach(file => {
            const { originalname } = file; // 获取原始文件名
            const ext = path.extname(originalname).toLowerCase(); // 获取文件扩展名并转换为小写
            const baseName = path.basename(originalname, ext).toLowerCase(); // 获取文件名（不包括扩展名）

            // 检查文件名和扩展名
            if (ext === '.js' || ext === '.mjs' || ext === '.cjs' || ext === '.html' || baseName.startsWith('index')) {
                // 如果文件不符合要求，删除已上传的临时文件
                fs.unlinkSync(file.path);
                errorFiles.push(originalname);
            }
        })
        if (errorFiles.length > 0) { return console.error('有恶意上传，已阻止') }
    }
    next()
})

export { mwSafaFilters }