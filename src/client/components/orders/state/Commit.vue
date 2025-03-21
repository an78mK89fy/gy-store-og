<script setup>
import { useStoreTodo } from '../../../stores/orders/useStoreTodo.js';
import { useStoreCommit } from '../../../stores/orders/useStoreCommit.js';
import { useTemplateRef } from 'vue'
const storeTodo = useStoreTodo(), { commit, save } = useStoreCommit()
const url = `${location.origin}/api/orders/todo/commit/save`
const elUploadRef = useTemplateRef('elUploadRef')
function uploadFile(file, fileList) { commit.file = file; if (fileList.length > 1) { fileList.shift() } }
function uploadRemove() { commit.file = {} }
function closeCommit() { uploadRemove(); for (let key in commit.data) { commit.data[key] = '' }; commit.paper = [] }
function uploadSuccess(res) {
    ElMessage(res.elMessage)
    if (res.elMessage.type === 'success') { commit.show = false; storeTodo.showProgress(storeTodo.progress.todo) }
}
</script>

<template>
    <el-dialog v-model="commit.show" :title="storeTodo.paper" center destroy-on-close fullscreen @close="closeCommit">
        <template #title v-if="commit.data.id">
            <el-input-tag v-model="commit.paper" :max="1" tag-type="warning" @remove-tag="commit.show = false" />
        </template>
        <el-form ref="elFormRef" label-width="auto" label-position="top">
            <el-form-item label="面单">
                <template #label>
                    <el-space>
                        <el-button type="info" text circle>
                            <el-icon size="16px"><el-icon-infoFilled /></el-icon>
                        </el-button>面单
                    </el-space>
                </template>
                <el-upload ref="elUploadRef" :action="url" :auto-upload="false" list-type="picture-card"
                    :data="commit.data" :on-change="uploadFile" :on-remove="uploadRemove" :on-success="uploadSuccess">
                    <el-text :type="commit.data.id ? 'warning' : 'primary'">
                        <el-space direction="vertical">
                            <el-icon size="24px"><el-icon-camera /></el-icon>点击后选择"相机"
                        </el-space>
                    </el-text>
                </el-upload>
            </el-form-item>
            <el-form-item label="张数">
                <el-input type="number" v-model="commit.data.count" placeholder="夹板纸的张数" size="large" clearable />
                <input type="hidden" :model="commit.data.id">
            </el-form-item>
        </el-form>
        <template #footer>
            <el-button :type="commit.data.id ? 'warning' : 'primary'" @click="save(elUploadRef)" size="large"
                :disabled="+commit.data.count <= 0" v-text="commit.data.id ? '修改' : '提交'" />
        </template>
    </el-dialog>
</template>

<style scoped></style>