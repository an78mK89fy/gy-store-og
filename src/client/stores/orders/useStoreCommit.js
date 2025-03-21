import { defineStore } from "pinia"
import { useStoreTodo } from "./useStoreTodo.js"
import { request } from "../../request/request.js"
import { toLocaleTime } from "../../utils/toLocalTime.js"

export const useStoreCommit = defineStore('commit', {
    state: () => ({
        commit: { show: false, data: { id: '', count: '', id_todo: '' }, paper: [], file: {} },
        picture: { show: false, img: '' }
    }),
    actions: {
        show(todo) {
            this.commit.data.id_todo = todo.id
            this.commit.show = true
        },
        showEdit(row) {
            const storeTodo = useStoreTodo()
            this.commit.paper[0] = storeTodo.paper
            this.commit.data.id = row.id
            this.commit.data.count = row.count
            this.commit.data.id_todo = storeTodo.progress.todo.id
            this.commit.show = true
        },
        save(elUploadRef) {
            if (+this.commit.data.count <= 0) { return }
            if (this.commit.file.name) { elUploadRef.submit() } else {
                request.orders.todo.commit.save(this.commit.data).then(res => {
                    if (res.data.elMessage?.type === 'success') {
                        const storeTodo = useStoreTodo()
                        this.commit.show = false;
                        storeTodo.showProgress(storeTodo.progress.todo)
                    }
                })
            }
        },
        delete(scope) {
            ElMessageBox.confirm(
                '确认删除吗', `${toLocaleTime(scope.row.timeCreate)} 的 ${scope.row.count}张`, {
                confirmButtonText: '删除', type: 'error'
            }).then(() => {
                request.orders.todo.commit.delete(scope.row.id).then(res => {
                    if (res.data.elMessage?.type === 'error') { return }
                    useStoreTodo().progress.rows.splice(scope.$index, 1)
                })
            }).catch(() => { })
        },
        showPicture(img) { this.picture.img = img; this.picture.show = true }
    },
    getters: { src: ({ picture: { img } }) => `${location.origin}/upload/${img}` }
})
