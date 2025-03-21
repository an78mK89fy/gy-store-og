import { defineStore } from "pinia"
import { request } from "../../request/request.js"
import { useStoreTodo } from "./useStoreTodo.js"
import printJS from 'print-js'

export const useStoreState = defineStore('state', {
    actions: {
        print(row) {
            printJS(`${location.origin}/upload/${row.img}`, 'image')
            if (row.id_prop_state.value !== '新') { return }
            request.orders.state.print(row.id).then(res => row.id_prop_state = res.data.state)
        },
        receive(scope) {
            ElMessageBox.prompt('填写切纸单订单数', `序${scope.$index + 1} "${scope.row.client}" 订单`, {
                inputPlaceholder: '订单数(大于0的整数)',
                inputType: 'number',
                inputPattern: /^[1-9]\d*$/,
                inputErrorMessage: '大于0的整数',
            }).then(({ value }) => request.orders.state.receive({ id: scope.row.id, count: +value }).then(res => {
                if (res.data.elMessage?.type === 'error') { return }
                scope.row.count = value
                if (!res.data.user) { return }
                scope.row.id_user = res.data.user
                if (!scope.row.todo?.length) { useStoreTodo().showCut(scope) }
            })).catch(() => { })
        },
        over(row) {
            request.orders.state.over(row.id).then(res => {
                row.id_prop_state = res.data.state
                row.timeLast = res.data.timeLast
            })
        },
        back(row) {
            request.orders.state.back(row.id).then(res => {
                if (!res.data.state) { return }
                row.id_prop_state = res.data.state
            })
        },
    }
})