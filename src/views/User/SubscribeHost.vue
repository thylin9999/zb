<template>
<div class="page h-100">
    <van-nav-bar
        title="关注列表"
        left-arrow
        @click-left="onClickLeft"
    />
    <div class="hosts  p-t-10" v-if="hosts.length > 0">
        <host-card
            v-for="host in hosts"
            :host="host"
            :key="host.id"
            @refresh="fetchData"
        />
    </div>
    <van-empty
        v-else
        class="custom-image"
        :image="require('../../assets/images/notFound.png')"
        description="暂无数据"
    />
</div>
</template>

<script>
import { NavBar, Empty } from 'vant'
import { getSubscribeHosts } from '@/api/user'
import { statusCode } from '@/utils/statusCode'
import HostCard from '@/views/User/Components/HostCard'
export default {
    name: 'SubscribeHost',
    components: {
        [NavBar.name]: NavBar,
        [Empty.name]: Empty,
        HostCard
    },
    data () {
        return {
            hosts: []
        }
    },
    created () {
        this.fetchData()
    },
    methods: {
        async fetchData () {
            const { data, code } = await getSubscribeHosts()
            if (code === statusCode.success) {
                this.hosts = data ? data.list.reduce((all, item) => {
                    all.push({
                        ...item,
                        isSubscribe: item.status === 1
                    })
                    return all
                }, []) : []
            }
        },
        onClickLeft () {
            this.$router.go(-1)
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/theme/default-vars.scss';
.page {
    background-color: #0E0E23 ;
}
.hosts {
    height: calc(100% - 46px);
    overflow-y: overlay;
    background-color: #0E0E23;
}
:v-deep {
    .host .card:last-child {
        border-bottom: none!important;
    }
}
</style>
