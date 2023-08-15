<template>
    <div class="video-box w-100">
        <video id="flv-id" style="width: 100%; height: 100%;" preload="auto" playsinline webkit-playsinline ref="video"></video>
        <video id="m3u8-id" v-show="videoID === 'm3u8-id'" style="width: 100%; height: 100%;" preload="auto" playsinline webkit-playsinline ref="video"></video>
        <div id="loading" v-if="firstLoading"></div>
    </div>
</template>

<script>
import { statusCode } from '@/utils/statusCode'
import { getSignurl } from '@/api/competition'
import { getPullUrl } from '@/utils/validator'
export default {
    name: 'VideoDisplay',
    props: {
        videoInfo: {
            type: Object,
            default: function () {
                return {}
            }
        }
    },
    data () {
        return {
            player: null,
            firstLoading: true,
            ordinary_video_url: null, // 普通地址
            HD_video_url: null, // 高清地址
            Original_video_url: null, // 超清地址
            showQuality: true, // 默认显示切清晰度切换
            videoID: 'flv-id'
        }
    },
    async mounted () {
        this.defindContrlPlay()
        await this.getPlayUrl('ordinary', 'flv')
        await this.getPlayUrl('HD', 'flv')
        await this.getPlayUrl('Original', 'flv')
    },
    methods: {
        // 播放地址初始化
        async getPlayUrl (qualityType, suffix) {
            if (this.videoInfo.video_url && this.videoInfo.video_url !== '') { // 后台自挂
                this.init_url(qualityType, this.videoInfo.video_url)
            } else { // 正常开播
                const { code, data } = await getSignurl({
                    suffix: suffix,
                    profile: qualityType === 'Original' ? '1080p' : qualityType === 'HD' ? '720p' : '480p',
                    room_id: this.$route.query.room_id
                })
                if (code === statusCode.success) {
                    const url = getPullUrl(data.info)
                    this.init_url(qualityType, url)
                }
            }
        },
        // 播放器初始化
        init () {
            const _this = this
            this.player = TCPlayer(this.videoID, {
                autoplay: true,
                muted: true,
                sources: [{ src: this.HD_video_url }],
                multiResolution: {
                    sources: {
                        'SD': [
                            {
                                src: this.ordinary_video_url
                            }
                        ],
                        'HD': [
                            {
                                src: this.HD_video_url
                            }
                        ],
                        'FHD': [
                            {
                                src: this.Original_video_url
                            }
                        ]
                    },
                    showOrder: ['SD', 'HD', 'FHD'],
                    defaultRes: 'HD'
                },
                controlBar: {
                    QualitySwitcherMenuButton: _this.showQuality, // 是否显示清晰度切换菜单。
                    progressControl: false, // 是否显示播放进度条。
                    currentTimeDisplay: false, // 是否显示视频当前时间。
                    playbackRateMenuButton: false // 是否显示播放速率选择按钮。
                }
            })
            this.player.on('canplay', function () {
                if (_this.firstLoading) _this.firstLoading = false
            })
            this.player.on('error', function (error) {
                if (_this.firstLoading) _this.firstLoading = false
                // 浏览器不兼容flv，更换流类型m3u8
                if (_this.showQuality) {
                    _this.player && _this.player.dispose()
                    _this.player = null
                    _this.videoID = 'm3u8-id'
                    _this.showQuality = false
                    _this.getPlayUrl('HD', 'm3u8')
                    console.log('播放器切换m3u8格式')
                }
            })
        },
        // 需要每个清晰度的url都获取完毕后再去初始化播放器
        init_url (qualityType, url) {
            if (qualityType === 'ordinary') {
                this.ordinary_video_url = url
            } else if (qualityType === 'HD') {
                this.HD_video_url = url
                if (!this.showQuality) this.init() // m3u8不能切换清晰度，当不显示清晰度切换按钮的时候，初始化播放器
            } else if (qualityType === 'Original') {
                this.Original_video_url = url
                this.init() // flv格式，需要每个清晰度的url都请求到了再去初始化播放器。
            }
        },
        // 自定义播放按钮
        defindContrlPlay () {
            const Button = TCPlayer.getComponent('Button')
            const BigPlayButton = TCPlayer.getComponent('BigPlayButton')
            BigPlayButton.prototype.createEl = function () {
                var el = Button.prototype.createEl.call(this)
                const _html = '<button class="play"></button>'
                el.appendChild(TCPlayer.dom.createEl('div', {
                    className: 'vjs-button-icon',
                    innerHTML: _html
                }))
                return el
            }
        }
    },
    beforeDestroy () {
        this.player && this.player.dispose()
    }
}
</script>

<style lang="scss" scoped>
    .video-box {
        height: 230px;
        background-color: #000;
        position: relative;
    }
    #loading{
        background: url('../assets/images/live/loading.gif') no-repeat;
        background-size: 100% 100%;
        position: absolute;
        width: 50px;
        height: 50px;
        top: 0;
        bottom: 0;
        right: 0;
        left: 0;
        margin: auto;
        z-index: 999;
    }
    ::v-deep{
        // 隐藏开始播放按钮，自动播放并静音
        // .play {
        //     background: url('../assets/icons/play.png');
        //     background-size: 100% 100%;
        //     width: 56px;
        //     height: 56px;
        // }
        .tcp-skin .tcp-loading-spinner:before{
            background: url('../assets/images/live/loading.gif') no-repeat;
            background-size: 100% 100%;
            border-left-color:rgba(0,0,0,0);
            border-right-color:rgba(0,0,0,0);
        }
        .tcp-skin.vjs-seeking .tcp-loading-spinner:before, .tcp-skin.vjs-waiting .tcp-loading-spinner:before{
            animation: none;
        }
    }
</style>
