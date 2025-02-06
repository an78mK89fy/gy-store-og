<script setup>
import { useStoreClient } from '../../../stores/useStoreClient.js';
const storeClient = useStoreClient()
</script>

<template>
    <el-dialog v-model="storeClient.dialog.show" destroy-on-close>
        <template #header>
            <el-button type="primary" text @click="storeClient.add(storeClient.dialog)">添加</el-button>客户
        </template>
        <el-form-item>
            <el-input v-model="storeClient.dialog.client" type="textarea" resize="none"
                :autosize="{ minRows: 2, maxRows: 4 }" placeholder="添加多个用空格分隔" />
        </el-form-item>
    </el-dialog>
</template>

<style scoped></style>