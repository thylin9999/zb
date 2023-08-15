<template>
<div class="w-100 h-100">
    <van-nav-bar
        title="所有直播"
        left-arrow
        @click-left="onClickLeft"
    />
    <div class="competition-section p-t-5">
        <HostBroads
        />
    </div>
</div>
</template>

<script>
import HostBroads from '@/views/Competition/Components/HostBroads'
import { NavBar } from 'vant'
export default {
    name: 'Recommend',
    components: {
        HostBroads,
        [NavBar.name]: NavBar
    },
    data () {
        return {
            competitions: []
        }
    },
    computed: {
        apiParams () {
            return {
                sportId: this.sportTabId,
                subId: this.subTabId,
                pagination: {
                    pageSize: 20,
                    currentPage: 1
                }
            }
        }
    },
    created () {
    },
    methods: {
        onClickLeft () {
            this.$router.go(-1)
        }
    }
}
</script>

<style lang="scss" scoped>
.competition-section {
    padding-bottom: 50px;
    height: calc(100% - 50px);
    overflow-y: overlay;
}
</style>
