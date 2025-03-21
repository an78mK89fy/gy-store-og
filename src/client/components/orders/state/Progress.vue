<script setup>
import { useStoreTodo } from '../../../stores/orders/useStoreTodo.js';
import { useStoreCommit } from '../../../stores/orders/useStoreCommit.js';
import { toLocaleTime } from '../../../utils/toLocalTime.js';
import { isState } from '../../../utils/isState.js';
const storeTodo = useStoreTodo(), { progress } = storeTodo, storeCommit = useStoreCommit(), { picture } = storeCommit
</script>

<template>
    <el-dialog v-model="progress.show" :title="storeTodo.paper" :fullscreen="isState.mobile" center align-center>
        <el-table :data="progress.rows" table-layout="auto" :height="isState.mobile ? '80dvh' : '60dvh'" show-summary
            v-loading="progress.isLoading">
            <el-table-column label="提交时间 ↑">
                <template #default="scope">
                    <el-text v-text="toLocaleTime(scope.row.timeCreate)" />
                </template>
            </el-table-column>
            <el-table-column label="张数(面单)" prop="count">
                <template #default="scope">
                    <el-button v-if="scope.row.img" type="primary" link @click="storeCommit.showPicture(scope.row.img)">
                        <el-space>
                            <el-text v-text="scope.row.count" type="primary" /><el-icon><el-icon-picture /></el-icon>
                        </el-space>
                    </el-button>
                    <el-button v-else v-text="scope.row.count" class="dis" link />
                </template>
            </el-table-column>
            <el-table-column label="详" type="expand"
                v-if="progress.todo.state !== '完成' && (isState.mobile || isState.dev)">
                <template #default="scope">
                    <el-descriptions border>
                        <el-descriptions-item label="操作" align="center">
                            <el-button type="warning" plain @click="storeCommit.showEdit(scope.row)">修改</el-button>
                            <el-button type="danger" round text bg @click="storeCommit.delete(scope)">删除</el-button>
                        </el-descriptions-item>
                    </el-descriptions>
                </template>
            </el-table-column>
        </el-table>
        <template #footer>
            <el-space v-if="progress.todo.state !== '完成'">
                <el-button type="success" round @click="storeTodo.state(progress.todo.id, '完成')"
                    v-if="isState.dev || isState.mobile">完结</el-button>
                <el-descriptions border>
                    <el-descriptions-item label="总数">
                        <el-text v-text="progress.todo.count" />
                    </el-descriptions-item>
                    <el-descriptions-item label="剩余">
                        <el-text v-text="progress.todo.count - storeTodo.sum" />
                    </el-descriptions-item>
                </el-descriptions>
                <el-button type="primary" round @click="storeCommit.show(progress.todo)"
                    v-if="isState.dev || isState.mobile">提交</el-button>
            </el-space>
        </template>
    </el-dialog>
    <el-image-viewer v-if="picture.show" :url-list="[storeCommit.src]" @close="picture.show = false" />
</template>

<style scoped>
.el-button.dis {
    cursor: default;
}

.el-text {
    font-family: Arial;
}
</style>