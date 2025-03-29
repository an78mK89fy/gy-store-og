<script setup>
import Todo from './state/Todo.vue';
import { isState } from '../../utils/isState.js';
import { toLocaleTime } from '../../utils/toLocalTime.js';
import { useStoreOrders } from '../../stores/useStoreOrders.js';
import { useStoreState } from '../../stores/orders/useStoreState.js';
import { useStoreTodo } from '../../stores/orders/useStoreTodo.js';
const origin = location.origin
const { scope } = defineProps(['scope'])
const storeOrders = useStoreOrders(), storeState = useStoreState(), storeTodo = useStoreTodo()
</script>

<template>
    <el-space direction="vertical" alignment="normal">
        <el-space>
            <el-button type="primary" text bg @click="storeState.print(scope.row)">
                <el-icon><el-icon-printer /></el-icon>打印
            </el-button>
            <el-button type="warning" plain :disabled="!isState.login" v-if="!isState.mobile"
                @click="storeOrders.edit(scope)">修改</el-button>
            <el-button type="danger" plain round :disabled="!isState.login" v-if="!isState.mobile" size="small"
                @click="storeOrders.delete(scope)">删除</el-button>
            <el-space v-if="(isState.mobile || isState.dev) && isState.login">
                <el-button type="primary" :disabled="scope.row.id_prop_state.value === '完成'"
                    @click="storeTodo.showCut(scope)">开切</el-button>
                <el-button type="success" @click="storeState.over(scope.row)"
                    v-if="!(scope.row.id_prop_state.value === '完成') && scope.row.count">切完</el-button>
                <el-button type="danger" @click="storeState.back(scope.row)"
                    v-if="scope.row.id_prop_state.value === '完成'">退回</el-button>
            </el-space>
            <el-button type="warning" plain @click="storeOrders.showEditLine(scope.row)"
                v-if="scope.row.editLine.length" v-text="toLocaleTime(scope.row.editLine[0]?.timeLint)" />
        </el-space>
        <Todo :scope="scope"></Todo>
        <div v-if="scope.row.note">
            <el-tag type="danger" style="display: inline-flex;">留言</el-tag>
            &nbsp;<span v-text="scope.row.note"></span>
        </div>
        <el-image class="cut" :alt="scope.row.img" :src="`${origin}/upload/${scope.row.img}`" />
    </el-space>
</template>

<style scoped></style>