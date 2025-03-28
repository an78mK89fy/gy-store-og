<script setup>
import { isState } from '../../../utils/isState.js';
import { useStoreOrders } from '../../../stores/useStoreOrders.js';
import { useStoreState } from '../../../stores/orders/useStoreState.js';
import { useStoreTodo } from '../../../stores/orders/useStoreTodo.js';
const props = defineProps(['scope'])
const { getType } = useStoreOrders(), storeState = useStoreState(), storeTodo = useStoreTodo()
</script>

<template>
    <el-collapse v-if="props.scope.row.count" @change="">
        <el-collapse-item :title="`进度: ${props.scope.row.todo?.length ?? 0} / ${props.scope.row.count}`">
            <template #title>
                <el-space>
                    <el-tag v-text="props.scope.row.id_user" v-if="props.scope.row.id_user" />
                    <el-text v-text="`进度: ${props.scope.row.todo?.length ?? 0} / ${props.scope.row.count}`" />
                    <el-button type="warning" text circle @click.stop="storeState.receive(props.scope)"
                        v-if="!(props.scope.row.id_prop_state.value === '完成') && ((isState.mobile || isState.dev) && isState.login)">改</el-button>
                </el-space>
            </template>
            <template #icon="{ isActive }">
                <el-text class="icon-ele" type="primary" v-text="isActive ? '点击收起 -' : '展开详情 +'" />
            </template>
            <el-table :data="props.scope.row.todo" table-layout="auto" row-key="id">
                <el-table-column label="切" prop="index" />
                <el-table-column label="状态">
                    <template #default="scope">
                        <el-text v-text="scope.row.state" :type="getType(scope.row.state)" />
                    </template>
                </el-table-column>
                <el-table-column label="张数(进度)" align="center">
                    <template #default="scope">
                        <el-button v-text="scope.row.count" type="primary" plain
                            @click="storeTodo.showProgress(scope.row, props.scope.row)" />
                    </template>
                </el-table-column>
                <el-table-column label="改" type="expand" v-if="isState.mobile || isState.dev">
                    <template #default="scope">
                        <el-descriptions border>
                            <el-descriptions-item label="操作" align="center">
                                <el-space v-if="scope.row.state !== '完成'">
                                    <el-button type="warning" plain
                                        @click="storeTodo.edit(props.scope, scope)">修改</el-button>
                                    <el-button type="danger" round text bg
                                        @click="storeTodo.delete(scope, props.scope.row.todo)">删除</el-button>
                                </el-space>
                                <el-button v-else type="danger"
                                    @click="storeTodo.state(scope.row.id, '进行中')">退回</el-button>
                            </el-descriptions-item>
                        </el-descriptions>
                    </template>
                </el-table-column>
            </el-table>
        </el-collapse-item>
    </el-collapse>
</template>

<style scoped>
.icon-ele {
    margin: auto;
}
</style>
<style>
.el-collapse-item__content {
    padding: 0;
}

.el-collapse-item__wrap {
    border: none;
}
</style>