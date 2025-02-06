<script setup>
import { useTemplateRef } from 'vue'
import { useStoreOrders } from '../../stores/useStoreOrders.js'
import { useStoreClient } from '../../stores/useStoreClient.js'

const storeOrders = useStoreOrders(), { formSave: { form } } = storeOrders
const { query } = useStoreClient()
const elFormRef = useTemplateRef('elFormRef')
const elUploadRef = useTemplateRef('elUploadRef')
function uploadFile(file, fileList) {
    if (fileList.length > 1) { fileList.shift() }
    setTimeout(() => elFormRef.value.validateField('img'), 0)
}
function handelPaste(event) {
    const file = (event.clipboardData || window.clipboardData).items[0].getAsFile()
    if (file) {
        elUploadRef.value.handleStart(file)
        form.file = file
    } else { ElMessage({ message: '剪切板为空', type: 'info' }) }
}
const rules = {
    client: [{ trigger: 'blur', required: true, message: '"客户"必填' }],
    img: [{
        trigger: 'blur', required: true, validator: (r, v, cb) => {
            if (form.fileList.length) { cb() } else { cb(new Error('"切纸单"未上传')) }
        }
    }]
}
</script>

<template>
    <el-card>
        <el-form ref="elFormRef" :model="form" :rules="rules" label-width="auto" label-position="top">
            <el-form-item label="客户" prop="client">
                <el-autocomplete name="client" v-model.trim="form.client" placeholder="名字" prop="client" clearable
                    :fetch-suggestions="query" @select="({ value }) => form.client = value" :trigger-on-focus="false" />
            </el-form-item>
            <el-form-item label="切纸单" prop="img">
                <el-upload ref="elUploadRef" v-model:file-list="form.fileList" :auto-upload="false"
                    :on-change="uploadFile" list-type="picture">
                    <el-space>
                        <el-input @paste="handelPaste" @click.stop placeholder="ctrl+v = 粘贴图片" />
                        <el-button type="primary" plain>点击上传 jpg/png</el-button>
                    </el-space>
                </el-upload>
            </el-form-item>
            <el-form-item label="留言" prop="note">
                <el-input type="textarea" name="note" v-model.trim="form.note" resize="none" placeholder="选填"
                    :rows="3" />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="storeOrders.save(elFormRef)">提交</el-button>
            </el-form-item>
        </el-form>
    </el-card><br>
</template>

<style scoped></style>