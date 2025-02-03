<script setup>
import { toLocaleTime } from '../../utils/toLocalTime.js';
import { useStoreAdmin } from '../../stores/useStoreAdmin.js';
const storeAdmin = useStoreAdmin(), { dialogReback } = storeAdmin
</script>

<template>
    <el-dialog v-model="dialogReback.show" title="恢复用户" @open="storeAdmin.list(1)" @close="storeAdmin.list"
        destroy-on-close>
        <el-table :data="dialogReback.rows" table-layout="auto" height="100%">
            <el-table-column label="序" type="index"></el-table-column>
            <el-table-column label="名字" prop="name"></el-table-column>
            <el-table-column label="操作">
                <template #default="scope">
                    <el-button type="success" plain size="small" @click="storeAdmin.reback(scope.row)">恢复</el-button>
                </template>
            </el-table-column>
            <el-table-column label="uid">
                <template #default="scope">
                    <el-tag v-text="scope.row.id" />
                </template>
            </el-table-column>
            <el-table-column label="删除时间">
                <template #default="scope">
                    <el-tag type="danger" v-text="toLocaleTime(+scope.row.phone)" />
                </template>
            </el-table-column>
        </el-table>
    </el-dialog>
</template>

<style scoped></style>