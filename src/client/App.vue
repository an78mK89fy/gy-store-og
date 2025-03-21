<script setup>
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import Dialog from './components/Dialog.vue'
</script>

<template>
  <el-config-provider :locale="zhCn">
    <RouterView></RouterView>
    <Dialog></Dialog>
  </el-config-provider>
</template>

<style scoped></style>