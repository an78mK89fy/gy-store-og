<script setup>
import { useStoreOrders } from '../../stores/useStoreOrders.js';
import { toLocaleTime } from '../../utils/toLocalTime.js';
const origin = location.origin
const storeOrders = useStoreOrders(), { dialogEditLine } = storeOrders
</script>

<template>
    <el-dialog v-model="dialogEditLine.show" width="min(800px,100%)" destroy-on-close>
        <template #header>修改次数 <el-tag v-text="dialogEditLine.row.editLine.length" type="warning" /></template>
        <el-timeline>
            <el-timeline-item timestamp="当前最新" placement="top" type="primary" size="large">
                <el-card>
                    <div>
                        <el-tag type="danger" style="display: inline-flex;">留言</el-tag>
                        &nbsp;<span v-text="dialogEditLine.row.note"></span>
                    </div>
                    <el-image v-if="dialogEditLine.row.img" :src="origin + '/upload/' + dialogEditLine.row.img" />
                </el-card>
            </el-timeline-item>
            <el-timeline-item v-for="item in dialogEditLine.row.editLine" :timestamp="toLocaleTime(item.timeLint)"
                placement="top" :hollow="true" type="warning">
                <el-card>
                    <div v-if="item.note">
                        <el-tag type="danger" style="display: inline-flex;">留言</el-tag>&nbsp;<span
                            v-text="item.note"></span>
                    </div>
                    <el-image v-if="item.img" :src="origin + '/upload/' + item.img" />
                </el-card>
            </el-timeline-item>
        </el-timeline>
    </el-dialog>
</template>

<style scoped>
.el-timeline {
    padding: 0;
}
</style>