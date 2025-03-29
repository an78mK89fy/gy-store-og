<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { request } from '../request/request.js'
import { isState } from '../utils/isState.js';
import { useStoreOrders } from '../stores/useStoreOrders.js';
import { toLocaleTime } from '../utils/toLocalTime.js';
const router = useRouter()
const storeOrders = useStoreOrders()
const orders = ref({})
const isLoading = ref(false)
if (isState.dev) { orders.value.id = true }
const id = location.search.substring(1)
if (id) {
    request.orders.id(id).then(({ data }) => {
        orders.value = data.row
        isLoading.value = false
    })
}
</script>

<template>
    <el-page-header @back="router.push('main')">
        <template #content><el-text type="info" v-text="id" /></template>
        <el-descriptions border v-if="orders.id">
            <el-descriptions-item label="切纸单状态">
                <el-tag v-text="orders.hidden ? '已关闭' : '开启'" :type="orders.hidden ? 'danger' : 'success'" />
            </el-descriptions-item>
            <el-descriptions-item label="客户"><el-text v-text="orders.client" /></el-descriptions-item>
            <el-descriptions-item label="自提"><el-text v-text="orders.self ? '是' : '否'" /></el-descriptions-item>
            <el-descriptions-item label="创建时间">
                <el-text v-text="toLocaleTime(orders.timeCreate)" />
            </el-descriptions-item>
            <el-descriptions-item label="创建时间">
                <el-text v-text="toLocaleTime(orders.timeLast)" />
            </el-descriptions-item>
            <el-descriptions-item label="仓库">奥光</el-descriptions-item>
            <el-descriptions-item label="修改记录">
                <el-button type="warning" plain @click="storeOrders.showEditLine(orders)">点击查看</el-button>
            </el-descriptions-item>
        </el-descriptions>
        <el-empty description="切纸单不存在" v-loading="isLoading" v-else />
    </el-page-header>
</template>

<style scoped></style>