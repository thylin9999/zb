<template>
<div class="bg-gray h-100">
    <van-nav-bar
        title="用户协议"
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
    name: 'Protocol',
    components: {
        [NavBar.name]: NavBar,
        [Toast.name]: Toast
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
        async fetchData () {
            try {
                const { data, code, msg } = await getContentList(2)
                if (code === statusCode.success) {
                    this.content = data.content
                } else {
                    Toast(msg)
                }
            } catch (e) {
                console.log('出错了')
            }
        },
        onClickLeft () {
            this.$router.go(-1)
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
