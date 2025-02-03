<script setup>
import { useTemplateRef } from 'vue'
import { useStoreOrders } from '../../stores/useStoreOrders.js'
import { regEx } from '../../../utils/regEx.js'

const storeOrders = useStoreOrders(), { create: { form: formSave } } = storeOrders
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
        formSave.file = file
    } else { ElMessage({ message: '剪切板为空', type: 'info' }) }
}
const rules = {
    gjpId: [{ trigger: 'blur', required: true, message: '"单据编号"必填' }, {
        trigger: 'blur', validator: (r, v, cb) => regEx.gjpId.test(v) ? cb() : cb(new Error('"单据编号"格式不正确'))
    }],
    img: [{
        trigger: 'blur', required: true, validator: (r, v, cb) => {
            if (formSave.fileList.length) { cb() }
            else { cb(new Error('"切纸单"未上传')) }
        }
    }]
}
</script>

<template>
    <el-card>
        <el-form ref="elFormRef" :model="formSave" :rules="rules" label-width="auto" label-position="top">
            <el-form-item label="单据编号" prop="gjpId">
                <el-input name="gjpId" v-model.trim="formSave.gjpId" placeholder="SD-YYYY-MM-DD-NNNNN" clearable
                    maxlength="19" show-word-limit />
            </el-form-item>
            <el-form-item label="客户名称" prop="client">
                <el-input name="client" v-model="formSave.client" placeholder="选填 (拼音首字母, 汉字自动转拼音)" clearable />
            </el-form-item>
            <el-form-item label="切纸单" prop="img">
                <el-upload ref="elUploadRef" v-model:file-list="formSave.fileList" :auto-upload="false"
                    :on-change="uploadFile" list-type="picture">
                    <el-space>
                        <el-input @paste="handelPaste" @click.stop placeholder="ctrl+v = 粘贴图片" />
                        <el-button type="primary" plain>点击上传 jpg/png</el-button>
                    </el-space>
                </el-upload>
            </el-form-item>
            <el-form-item label="留言" prop="note">
                <el-input type="textarea" name="note" v-model.trim="formSave.note" resize="none" placeholder="选填"
                    :rows="3" />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="storeOrders.save(elFormRef)">提交</el-button>
            </el-form-item>
        </el-form>
    </el-card><br>
</template>

<style scoped></style>