<script setup>
import Client from '../components/orders/menu/Client.vue';
import EditLine from '../components/orders/EditLine.vue';
import TodoCut from './orders/state/TodoCut.vue';
import Commit from './orders/state/Commit.vue';
import Paper from '../components/orders/menu/Paper.vue'
import Progress from './orders/state/Progress.vue';
</script>

<template>
    <Client></Client>
    <EditLine></EditLine>
    <TodoCut></TodoCut>
    <Commit></Commit>
    <Paper></Paper>
    <Progress></Progress>
</template>

<style scoped></style>