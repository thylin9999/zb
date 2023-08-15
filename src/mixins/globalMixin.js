/*eslint-disable*/
import { mapState, mapMutations } from 'vuex'

export const globalMixin = {
    computed: {
        ...mapState('commonData', ['serviceSite', 'appUrls']),
        browserInfo () {
            const u = navigator.userAgent
            // const app = navigator.appVersion
            return {
                trident: u.indexOf('Trident') > -1,
                presto: u.indexOf('Presto') > -1,
                webKit: u.indexOf('AppleWebKit') > -1,
                gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1,
                mobile: !!u.match(/AppleWebKit.*Mobile.*/) || !!u.match(/AppleWebKit/),
                ios: !!u.match(/(i[^;]+;(U;)? CPU.+Mac OS X)/),
                android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1,
                iPhone: u.indexOf('iPhone') > -1 || u.indexOf('Mac') > -1,
                iPad: u.indexOf('iPad') > -1,
                webApp: u.indexOf('Safari') == -1
            }
        },
        isIos () {
            return !!this.browserInfo.ios
        },
        isAnd () {
            return !!this.browserInfo.android
        },
        emptyImg() {
            return  require('../assets/images/common/team-flag.png')
        },
        userEmptyImg() {
            return require('../assets/images/my/user-empty.png')
        },
        _appDownloadUlr() {
            return this.appUrls.android_link
        },
        _appDownloadUlrIOS() {
            return this.appUrls.ios_link
        },
        checkedLogo() {
            return require('../assets/images/common/check-solid.png')
        },
        checkEmpty() {
            return require('../assets/images/common/check-empty.png')
        }
    },
    methods: {
        ...mapMutations('commonData', ['SET']),
        enterLiveRoom(matchInfo, anchor) {
            this.$router.push({
                name: 'Broadcast',
                params: {
                    id: matchInfo.matchId
                },
                query: { room_id: anchor.room_id }
            })
        },
        queryCustom () {
            window.open(this.serviceSite, '_blank')
        },
        openDownloadDialog() {
            this.SET({ showDownloadDialog: true})
        },
        closeDownloadDialog() {
            this.SET({ showDownloadDialog: false})
        },
        openLoginDialog() {
            this.SET({
                showLoginDialog: true
            })
        },
        closeLoginDialog() {
            this.SET({
                showLoginDialog: false
            })
        },
        goToLogin(redirect) {
            this.$router.replace({
                path: '/user/login',
                query: {
                    redirect: redirect
                }
            })
        }

    }
}
