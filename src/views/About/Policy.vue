<template>
<div class="bg-gray h-100">
    <van-nav-bar
        title="隐私政策"
        left-arrow
        @click-left="onClickLeft"
    />
    <div class="content p-10 text-white" v-html="content">

    </div>
</div>
</template>

<script>
import { NavBar, Toast } from 'vant'
import { getContentList } from '@/api/common'
import { statusCode } from '@/utils/statusCode'

export default {
    name: 'Policy',
    components: {
        [NavBar.name]: NavBar
    },
    data () {
        return {
            content: null
        }
    },
    created () {
        this.fetchData()
    },
    methods: {
        onClickLeft () {
            this.$router.go(-1)
        },
        async fetchData () {
            try {
                const { data, code, msg } = await getContentList(3)
                if (code === statusCode.success) {
                    this.content = data.content
                } else {
                    Toast(msg)
                }
            } catch (e) {
                console.log('出错了')
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.content {
    height: calc(100vh - 106px);
    overflow-y: auto;
}
</style>
