<template>
  <div id="app" class="p-relative" :key="updateKey">
      <Header v-if="!!hideHeader" />
      <div class="app-body"
        :class="{
            'has-header': !!hideHeader,
            'has-footer': !hideFooter,
        }"
      >
        <router-view/>
      </div>
      <Footer v-if="!hideFooter"/>
      <DownloadDialog />
      <LoginDialog />
      <go-to-login/>
<!--            <div class="test p-fixed">-->
<!--                <SvgaAnimation />-->
<!--            </div>-->
  </div>
</template>
<script >
// import SvgaAnimation from '@/components/SvgaAnimation'
import Footer from '@/views/Layout/Footer'
import Header from './views/Layout/Header.vue'
import { mapState, mapActions, mapMutations } from 'vuex'
import { getToken } from '@/utils/cookie'
import DownloadDialog from '@/components/DownloadDialog'
import LoginDialog from '@/components/LoginDialog'
import GoToLogin from '@/components/GoToLogin'
import { getDownloadUrls, getNewsTypes } from '@/api/common'
import { statusCode } from '@/utils/statusCode'
import ScoreWs from '@/utils/scoreWs'
export default {
    name: 'App',
    components: {
        Footer,
        Header,
        DownloadDialog,
        LoginDialog,
        GoToLogin
        // SvgaAnimation
    },
    provide () {
        return {
            reloadPage: this.reload
        }
    },
    data () {
        return {
            updateKey: +new Date().getTime()
        }
    },
    computed: {
        ...mapState('user', ['token']),
        ...mapState('commonData', ['isExpired']),
        hideFooter () {
            return this.$route.meta ? !!this.$route.meta.hideFooter : false
        },
        hideHeader () {
            return this.$route.meta ? !!this.$route.meta.hideHeader : false
        }
    },
    watch: {
        isExpired: {
            handler () {
                if (this.isExpired) {
                    // 判断是否为个人中心，跳转 我的，其他刷新页面
                    if (this.$route.meta.requireAuthorization) {
                        console.log(this.$route, 'asdf')

                        this.$router.push({
                            name: 'My'
                        })
                    } else {
                        this.updateKey = +new Date().getTime()
                    }
                }
            },
            immediate: true
        }
    },
    created () {
        const token = getToken('token')
        if (token) {
            this.getUserInfo()
        }
        this.getUrls()
        this.initWs()
        this.getNewsTypes()
    },
    methods: {
        ...mapActions('user', ['getUserInfo']),
        ...mapMutations('user', ['SET']),
        async getUrls () {
            try {
                const { data, code } = await getDownloadUrls()
                if (code === statusCode.success) {
                    this.$store.commit('commonData/SET', {
                        appUrls: { ...data }
                    })
                }
            } catch (e) {
                console.log('出错了')
            }
        },
        initWs () {
            ScoreWs.initScoreWs()
        },
        reload () {
            this.updateKey = +new Date().getTime()
        },
        async getNewsTypes () {
            try {
                const { data, code } = await getNewsTypes()
                if (code === statusCode.success) {
                    const tabs = data.reduce((all, item, index) => {
                        all.push({
                            label: item,
                            id: index
                        })
                        return all
                    }, [])
                    this.$store.commit('commonData/SET', { newsTypes: tabs })
                }
            } catch (e) {
                console.log('出错了', e)
            }
        }
    }
}
</script>
<style lang="scss" scoped>
#app {
    height: 100%;
}
.app-body {
    height: 100%;
}
.has-header {
    height: calc(100vh - 54px);
}
.has-footer {
    height: calc(100vh - 65px);
}
.has-header.has-footer {
    height: calc(100vh - 119px);
}
::-webkit-scrollbar{
    width: 0 !important;
}
::-webkit-scrollbar{
    width: 0 !important;
    height: 0;
}
.van-tab--active{
    color: #FBA187;
}

.test{
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: #fff;
    z-index: 1000;
}
</style>
