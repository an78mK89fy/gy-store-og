<script setup>
import { reactive, useTemplateRef } from 'vue'
import { request } from '../request/indexRequest.js'
import { ElMessage } from 'element-plus'
const form = reactive({ id: '', file: {}, fileList: [], note: '' })
function uploadFile(file, fileList) {
    if (fileList.length > 1) { fileList.shift() }
}
const elFormRef = useTemplateRef('elFormRef')
const elUploadRef = useTemplateRef('elUploadRef')
const modelValue = defineModel()
function save(elForm) {
    if (form.id && form.fileList.length) {
        if (form.id.length !== 19) {
            return ElMessage({ message: '"单据编号"长度为19位', type: 'warning' })
        }
        const formData = new FormData(elFormRef.value.$el)
        if (!formData.get('file').name) {
            formData.set('file', form.file)
        }
        request.orders.save(formData).then(res => {
            if (res.data.elMessage) { return ElMessage(res.data.elMessage) }
            modelValue.value.unshift(res.data.orders)
            form.fileList.length = 0
            elForm.resetFields()
            ElMessage({ message: '成功', type: 'success' })
        }).catch(err => ElMessage({ message: err, type: 'error' }))
    } else { ElMessage({ message: '"单据编号"或"切纸单"不得为空', type: 'warning' }) }
}
function handelPaste(event) {
    const file = (event.clipboardData || window.clipboardData).items[0].getAsFile()
    if (file) {
        elUploadRef.value.handleStart(file)
        form.file = file
    } else { ElMessage({ message: '剪切板为空', type: 'info' }) }
}
</script>

<template>
    <el-card>
        <el-form ref="elFormRef" :model="form" label-width="auto" label-position="top">
            <el-form-item label="单据编号" prop="id">
                <el-input name="id" v-model="form.id" placeholder="SD-YYYY-MM-DD-NNNNN"></el-input>
            </el-form-item>
            <el-form-item label="切纸单">
                <el-upload ref="elUploadRef" v-model:file-list="form.fileList" :auto-upload="false"
                    :on-change="uploadFile" list-type="picture">
                    <el-input @paste="handelPaste" @click.stop placeholder="ctrl+v = 粘贴图片"></el-input>
                    <el-button type="primary" plain>点击上传 jpg/png</el-button>
                </el-upload>
            </el-form-item>
            <el-form-item label="留言">
                <el-input type="textarea" name="note" v-model="form.note" resize="none" placeholder="选填" :rows="3" />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="save(elFormRef)">提交</el-button>
            </el-form-item>
        </el-form>
    </el-card>
</template>

<style scoped></style>