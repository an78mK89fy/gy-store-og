<script setup>
import Todo from './state/Todo.vue';
import { isState } from '../../utils/isState.js';
import { toLocaleTime } from '../../utils/toLocalTime.js';
import { useStoreOrders } from '../../stores/useStoreOrders.js';
import { useStoreState } from '../../stores/orders/useStoreState.js';
import { useStoreTodo } from '../../stores/orders/useStoreTodo.js';
const origin = location.origin

const props = defineProps(['scope'])
const storeOrders = useStoreOrders(), storeState = useStoreState(), storeTodo = useStoreTodo()
const disCut = (row) => row.id_prop_state.value === '完成' || row.count ? row.todo.length >= row.count : false
</script>

<template>
    <el-space direction="vertical" alignment="normal">
        <el-space>
            <el-button type="primary" text bg @click.stop="storeState.print(props.scope.row)">
                <el-icon><el-icon-printer /></el-icon>打印
            </el-button>
            <el-space v-if="(isState.mobile || isState.dev) && isState.login">
                <el-button type="primary" :disabled="disCut(props.scope.row)"
                    @click="storeTodo.showCut(props.scope)">开切</el-button>
                <el-button type="success" @click="storeState.over(props.scope.row)"
                    v-if="!(props.scope.row.id_prop_state.value === '完成') && props.scope.row.count">切完</el-button>
                <el-button type="danger" @click="storeState.back(props.scope.row)"
                    v-if="props.scope.row.id_prop_state.value === '完成'">退回</el-button>
            </el-space>
            <el-button type="warning" plain @click="storeOrders.showEditLine(props.scope.row)"
                v-if="props.scope.row.editLine.length" v-text="toLocaleTime(props.scope.row.editLine[0]?.timeLint)" />
        </el-space>
        <Todo :scope="props.scope"></Todo>
        <div v-if="props.scope.row.note">
            <el-tag type="danger" style="display: inline-flex;">留言</el-tag>
            &nbsp;<span v-text="props.scope.row.note"></span>
        </div>
        <el-image class="cut" :alt="props.scope.row.img" :src="`${origin}/upload/${props.scope.row.img}`" />
    </el-space>
</template>

<style scoped></style>