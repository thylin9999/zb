<template>
<div class="page"
     :class="{
        'h-100 overflow-y-auto': !isAll
     }"
>
    <p v-if="isAll" class="title p-t-10 p-l-20 p-b-10 font-14 font-400 ">相关主播</p>
    <div class="list">
        <template v-if="list.length">
            <host-card
                class="m-b-5"
                v-for="host in list"
                :host="host"
                :key="host.id"
                @refresh="fetchData"
            />
        </template>
        <NoData class="flex align-center flex-column"
            v-if="!isLoading && !list.length"
        />
    </div>
</div>
</template>

<script>
import { mapState } from 'vuex'
import { statusCode } from '@/utils/statusCode'
import { searchAnchor, followHost } from '@/api/Host'
import HostCard from '@/views/User/Components/HostCard'
import NoData from '@/components/NoData'
import { Toast } from 'vant'
export default {
    name: 'Host.vue',
    components: {
        [Toast.name]: Toast,
        HostCard,
        NoData
    },
    props: {
        search: {
            type: String,
            default: ''
        },
        isAll: { // 是否位列表页
            type: Boolean,
            default: false
        }
    },
    data () {
        return {
            isLoading: false,
            list: []
        }
    },
    created () {
        this.fetchData()
    },
    computed: {
        ...mapState('user', ['token'])
    },
    methods: {
        async fetchData () {
            this.isLoading = true
            if (!this.isAll) {
                // Toast.loading()
                this.$showLoading()
            }
            try {
                const { data, code } = await searchAnchor(this.search)
                if (code === statusCode.success) {
                    this.total = (data && data.length) || 0
                    if (!this.isAll) {
                        this.list = data || []
                    } else {
                        const list = data || []
                        this.list = list.slice(0, 10)
                    }
                }
            } catch (e) {
                console.log('出错了')
            } finally {
                this.isLoading = false
                if (!this.isAll) {
                    // Toast.clear()
                    this.$hideLoading()
                }
            }
        },
        async subscribe (anchor) {
            // 是否订阅的
            if (this.token) {
                // 取消订阅
                const { msg } = await followHost(anchor.member_id)
                Toast.success(msg)
            } else {
                // 未订阅
                this.openLoginDialog()
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.title {
    color: #48506B;
}
</style>
