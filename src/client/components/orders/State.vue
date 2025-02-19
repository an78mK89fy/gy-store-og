<script setup>
import { isState } from '../../utils/isState.js';
import { reactive } from 'vue';
const props = defineProps(['scope'])
const state = reactive({ count: 0 })
const storeState = {
    receive(count) {
        ElMessageBox.prompt('填写切纸单订单数', `序${props.scope.$index + 1} "${props.scope.row.client}" 订单`, {
            inputPlaceholder: '订单数',
            inputType: 'number'
        }).then(({ value }) => {

        })
    }
}
</script>

<template>
    <el-space v-if="(isState.mobile || isState.dev) && isState.login">
        <el-button type="info" @click="storeState.receive()">领取</el-button>
        <el-button type="primary" @click="">开切</el-button>
        <el-button type="success" @click="">切完</el-button>
        <el-button type="warning" @click="">撤销</el-button>
    </el-space>
</template>

<style scoped></style>