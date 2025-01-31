<script setup>
import { reactive, useTemplateRef } from 'vue'
import { request } from '../../request/request.js'
import { isState } from '../../utils/isState.js'

const formOrders = reactive({ gjpId: '', client: '', file: {}, fileList: [], note: '' })
function uploadFile(file, fileList) { if (fileList.length > 1) { fileList.shift() } }
const elFormRef = useTemplateRef('elFormRef')
const elUploadRef = useTemplateRef('elUploadRef')
const modelValue = defineModel()
function save(elForm) {
    if (formOrders.gjpId && formOrders.fileList.length) {
        if (formOrders.gjpId.length !== 19) { return ElMessage({ message: '"单据编号"长度为19位', type: 'warning' }) }
        const formData = new FormData(elFormRef.value.$el)
        if (!formData.get('file').name) { formData.set('file', formOrders.file) }
        request.orders.save(formData).then(res => {
            if (!res.data.orders) { return } // 没返回orders
            modelValue.value.unshift(res.data.orders)
            formOrders.fileList.length = 0
            elForm.resetFields()
        })
    } else { ElMessage({ message: '"单据编号"或"切纸单"不得为空', type: 'warning' }) }
}
function handelPaste(event) {
    const file = (event.clipboardData || window.clipboardData).items[0].getAsFile()
    if (file) {
        elUploadRef.value.handleStart(file)
        formOrders.file = file
    } else { ElMessage({ message: '剪切板为空', type: 'info' }) }
}
</script>

<template>
    <el-card>
        <el-form v-if="isState.login" ref="elFormRef" :model="formOrders" label-width="auto" label-position="top">
            <el-form-item label="单据编号" required>
                <el-input name="gjpId" v-model.trim="formOrders.gjpId" placeholder="SD-YYYY-MM-DD-NNNNN" clearable
                    maxlength="19" show-word-limit />
            </el-form-item>
            <el-form-item label="客户名称">
                <el-input name="client" v-model="formOrders.client" placeholder="选填" clearable />
            </el-form-item>
            <el-form-item label="切纸单" required>
                <el-upload ref="elUploadRef" v-model:file-list="formOrders.fileList" :auto-upload="false"
                    :on-change="uploadFile" list-type="picture">
                    <el-input @paste="handelPaste" @click.stop placeholder="ctrl+v = 粘贴图片" />
                    <el-button type="primary" plain>点击上传 jpg/png</el-button>
                </el-upload>
            </el-form-item>
            <el-form-item label="留言">
                <el-input type="textarea" name="note" v-model.trim="formOrders.note" resize="none" placeholder="选填"
                    :rows="3" />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="save(elFormRef)">提交</el-button>
            </el-form-item>
        </el-form>
        <b v-else>仅浏览模式</b>
    </el-card>
</template>

<style scoped></style>