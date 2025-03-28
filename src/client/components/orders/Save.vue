<script setup>
import { useTemplateRef } from 'vue'
import { useStoreOrders } from '../../stores/useStoreOrders.js'
import { useStoreClient } from '../../stores/useStoreClient.js'
import { isState } from '../../utils/isState.js'
const storeOrders = useStoreOrders(), { dialogPreview, formSave: { form } } = storeOrders
const { query, dialog: dialogClient } = useStoreClient()
const elFormRef = useTemplateRef('elFormRef')
const elUploadRef = useTemplateRef('elUploadRef')
function uploadFile(file, fileList) {
    form.file = file
    if (fileList.length > 1) { fileList.shift() }
    setTimeout(() => elFormRef.value.validateField('img'), 0)
}
function paste(event) {
    function pushImg(file) {
        if (file) {
            elUploadRef.value.handleStart(file)
            form.file = file
        } else { throw new Error('剪切板没有图片') }
    }
    if (event.type === 'paste') {
        pushImg((event.clipboardData || window.clipboardData).items[0].getAsFile())
    } else {
        navigator.clipboard.read().then(content => {
            if (!content[0].types.includes("image/png")) { throw new Error('剪切板没有图片') }
            content[0].getType('image/png').then(pushImg)
        }).catch(({ message }) => ElMessage({ message, type: 'info' }))
    }
}
const rules = {
    client: [{ trigger: 'change', required: true, message: '"客户"必填' }],
    img: [{
        trigger: 'blur', required: true, validator: (r, v, cb) => {
            if (form.fileList.length) { cb() } else { cb(new Error('"切纸单"未上传')) }
        }
    }]
}
</script>

<template>
    <el-card>
        <el-form ref="elFormRef" :model="form" :rules="rules" label-position="top">
            <el-form-item v-show="false" prop="id"><input type="hidden" name="id" :model="form.id"></el-form-item>
            <el-form-item prop="client">
                <template #label>
                    <el-space>客户
                        <el-form-item prop="index" v-show="form.id">
                            <el-input-tag v-model="form.index" :max="1" tag-type="warning" size="small"
                                @remove-tag="() => { elFormRef.resetFields(); form.fileList.length = 0 }" />
                        </el-form-item>
                    </el-space>
                </template>
                <el-autocomplete name="client" v-model.trim="form.client" clearable :fetch-suggestions="query"
                    :disabled="!!form.id" @select="({ value }) => form.client = value" :trigger-on-focus="false"
                    :debounce="0" placeholder="拼音首字母 = 搜索">
                    <template #append v-if="!form.id">
                        <el-button @click="dialogClient.show = true">
                            <el-space>
                                <el-icon><el-icon-user /></el-icon>添加客户
                            </el-space>
                        </el-button>
                    </template>
                </el-autocomplete>
            </el-form-item>
            <el-form-item prop="img">
                <template #label>切纸单<el-button type="primary" round text v-show="form.fileList.length" size="small"
                        @click="storeOrders.preview">预览</el-button></template>
                <el-upload ref="elUploadRef" v-model:file-list="form.fileList" :auto-upload="false"
                    :on-change="uploadFile" :on-preview="storeOrders.preview" list-type="picture">
                    <el-space>
                        <el-input @paste="paste" @click.stop placeholder="ctrl+v = 粘贴">
                            <template #append v-if="!isState.mobile">
                                <el-tooltip content="win7暂不支持">
                                    <el-button @click.stop="paste">点击粘贴</el-button>
                                </el-tooltip>
                            </template>
                        </el-input>
                        <el-button class="upload" :type="form.id ? 'warning' : 'primary'" plain>本地上传 jpg/png</el-button>
                    </el-space>
                </el-upload>
            </el-form-item>
            <el-form-item label="留言" prop="note">
                <el-input type="textarea" name="note" v-model.trim="form.note" resize="none" placeholder="选填"
                    :rows="3" />
            </el-form-item>
            <!-- <el-form-item label="仓库" required>
                <el-radio-group modelValue="ag">
                    <el-radio value="ag">奥光</el-radio>
                    <el-radio value="zx">中心</el-radio>
                    <el-radio value="wc">旺厂</el-radio>
                </el-radio-group>
            </el-form-item> -->
            <el-form-item>
                <el-space>
                    <el-button class="upload" :type="form.id ? 'warning' : 'primary'" v-text="form.id ? '修改' : '提交'"
                        @click="storeOrders.save(elFormRef)" />
                    <el-checkbox v-model="form.self" label="自提" value="1" name="self" border />
                </el-space>
            </el-form-item>
        </el-form>
        <el-dialog v-model="dialogPreview.show"><el-image :src="dialogPreview.url" /></el-dialog>
    </el-card><br>
</template>

<style scoped>
.el-form * {
    transition: all 300ms;
}
</style>