<template>
    <div class="video-box w-100">
        <!--    <img class="w-100 h-100" src="../assets/images/player-enter.gif" alt="">-->
        <div class="video-player" style="width: 100%;height: 100%" @click.prevent="showControl = !showControl">
            <div id="video-player-tag"></div>
            <div id="dplayer" ref="dplayer" style="width: 100%;height: 100%">
                <!--                <div style="width: 100%;height: 100%">-->
                <!--                    <img :src="liveCover" alt="" draggable="false" style="width: 100%;height: 100%">-->
                <!--                </div>-->
            </div>
            <!--            <div class="showRefresh btn" @mousemove="showRefresh = true" @mouseleave="showRefresh = false">-->
            <!--                <p @click="videoRefresh">刷新</p>-->
            <!--            </div>-->
            <div class="control ignore-" @click.prevent="showQuality = !showQuality" ref="quality">
                <span class="btn"> {{ qualityType == 'Original' ? '超清' : qualityType == 'HD' ? '高清' : '普通'
                    }}  </span>
                <div class="control_box" v-show="showQuality">
                    <ul class="quality_list">
                        <span class="btn" @click="changeQuality('Original')">超清</span>
                        <span class="btn" @click="changeQuality('HD')">高清</span>
                        <span class="btn" @click="changeQuality('ordinary')">普通</span>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>

<script src="flv.min.js"></script>
<script src="hls.min.js"></script>
<script src="DPlayer.min.js"></script>
<script>
    import Hls from 'hls.js'
    import {qulities} from "@/utils/utils";
    import Axios from "axios";
    import {statusCode} from "@/utils/statusCode";
    import {getSignurl} from "@/api/competition";
    import {getPullUrl} from "@/utils/validator";

    export default {
        name: 'VideoDisplay',
        props: {
            isLive: {
                type: Boolean,
                default: () => true
            },
            videoInfo: {
                type: Object,
                default: function () {
                    return {}
                }
            },
            refresh: {  //当前界面是刷新操作会暂停 备用
                type: Boolean,
                default: false
            },
        },
        data() {
            return {
                firstLoad: true,
                // pushPause: false,
                showControl: true,
                volume: 0.5,
                muteButton: false,
                liveCover: '',
                logo: require("@/assets/images/logo.png"),
                refreshItem: true,
                showQuality: false,
                showRefresh: false,
                roomInfo: {},
                timeOut: false,
                dp: null,
                qualityType: 'Original', // 'Original'  'HD'  'ordinary'
                showPuse: false,
            }
        },
        async mounted() {
            // this.$bus.$on('send', val => {
            //     this.sendDankamu(val)
            // }),
            //     this.$on('sendDankamu', val => {
            //         this.sendDankamu(val)
            //     })
            this.roomInfo = this.videoInfo
            this.liveCover = this.videoInfo.live_cover
            try {
                setTimeout(() => {
                    this.showPuse = true;
                    this.showPuse = false;
                    this.getPlayUrl()
                    // this.changeQuality(this.qualityType)
                }, 1000)
            } catch (e) {
            }
        },
        methods: {
            async getPlayUrl() {
                if (this.roomInfo.video_url && this.roomInfo.video_url !== '') {
                    await this.init()
                } else {
                    let {code, data} = await getSignurl({
                        suffix: 'm3u8',
                        profile: this.qualityType === 'Original' ? '1080p' : this.qualityType === 'HD' ? '720p' : '480p',
                        room_id: this.$route.query.room_id
                    })
                    if (code === statusCode.success) {
                        this.roomInfo.md5_video = getPullUrl(data.info)
                        await this.init()
                    }
                }
            },
            sendDankamu(msgJson) {
                Axios.post(_dankamuUrl, msgJson).then(res => {
                    if (this.dp) {
                        this.dp.danmaku.draw(res.data.data)
                    }
                })
            },
            cancelMute() {
                if (this.dp) {
                    this.dp.volume(0.5)
                    this.muteButton = false
                }
            },
            handlePlay() {
                this.$refs.dplayer.play()
                this.isPlay = false
            },
            handlePause() {
                alert('pause')
                this.$refs.dplayer.pause()
                this.showPuse = true
            },
            bigPause() {
                this.showPuse = false
                this.timeOut = true
                if (this.dp) {
                    this.dp.toggle()
                }
            },
            changeQuality(type) {
                this.qualityType = type || 'HD'
                this.getPlayUrl()
                // this.showQuality = false  //高清... 切换 展示
                // let rtmp_url = this.roomInfo.rtmp_url
                // let rtmp_live = this.roomInfo.rtmp_live
                // let url = rtmp_url + "?" + rtmp_live
                // // url = url.replace("m3u8", "flv") //m3u8转flv
                // this.playList = {
                //     'Original': url.replace(rtmp_url.split("_")[1], '1080p.m3u8'),
                //     'HD': url.replace(rtmp_url.split("_")[1], '720p.m3u8'),
                //     'ordinary': url.replace(rtmp_url.split("_")[1], '480p.m3u8'),
                // }
                // this.init()
            },
            videoRefresh() {
                this.init()
            },
            async init() {
                let that = this
                if (this.roomInfo) {
                    let url = ""
                    // if (this.playList) {
                    //     url = this.playList[this.qualityType]
                    // } else {
                    //     url = `${this.roomInfo.rtmp_url}?${this.roomInfo.rtmp_live}`
                    // }
                    // debugger
                    if (this.roomInfo.video_url && this.roomInfo.video_url !== '') {
                        url = this.roomInfo.video_url.replace(".flv", ".m3u8")
                    } else {
                        if (this.playList) {
                            url = this.playList[this.qualityType]
                        } else {
                            url = this.roomInfo.md5_video
                            // url = `${this.roomInfo.rtmp_url}?${this.roomInfo.rtmp_live}`
                        }
                    }
                    console.log(url)
                    window.flvjs = (await import(/* webpackChunkName: "flv" */ 'flv.js')).default
                    const DPlayer = (await import(/* webpackChunkName: "dplayer" */ 'dplayer')).default
                    // const videoQualities = Object.keys(this.playList).reduce((all, key) => {
                    //     all.push({
                    //         name: qulities[key],
                    //         type: 'auto',
                    //         url: this.playList[key]
                    //     })
                    //     return all
                    // }, [])
                    this.dp = new DPlayer({
                        container: document.getElementById("dplayer"),
                        autoplay: true,
                        live: this.isLive,
                        volume: 0.5,
                        hotkey: true,
                        lang: "zh-cn",
                        // danmaku: {
                        //     id: 'hbzb',
                        //     api: 'https://dplayer.moerats.com/'
                        // },
                        danmaku: false,
                        video: {
                            // quality: videoQualities,
                            // defaultQuality: 0,
                            url,
                            type: 'customHls', // auto
                            customType: {
                                customHls: function (video) { // player
                                    that.newHls?.destroy()
                                    that.newHls = new Hls()
                                    that.newHls.on(Hls.Events.ERROR, function (eventName, data) {
                                        const {type, details} = data
                                        if (type === 'networkError') { // 网络错误
                                            switch (details) {
                                                case  'manifestLoadTimeOut': // 超时
                                                    console.log('超时重置...')
                                                    that.changeQuality(that.qualityType)
                                                    break;
                                                default:
                                                    console.log(data)
                                            }
                                        }
                                        console.log(eventName, data)
                                        // if (data.type ==='newworkError') {
                                        //   console.log(data)
                                        // }
                                        // console.log(eventName, data, player)
                                        // 埋点上报，可以追踪data.details
                                        // track()
                                    })
                                    that.newHls.loadSource(video.src)
                                    that.newHls.attachMedia(video)
                                }
                            }
                        },
                        icons: {
                            fullscreen: require('@/assets/images/live/loading.gif')
                        }
                    })
                    this.dp.volume(this.volume) // 设置初始声音
                    setTimeout(() => {
                        this.dp.play()
                    }, 500)
                    if (this.dp) {
                        let item1 = document.getElementsByClassName('dplayer-full-in-icon')[0]
                        item1.style.display = 'none'  //移动端隐藏一个全屏按钮
                        let item = document.getElementsByClassName('dplayer-controller')[0]
                        let link = document.createElement('div')
                        // link.innerHTML = "刷新"
                        link.className = 'showRefresh'
                        item.appendChild(link)
                        link.addEventListener("click", function () {
                            that.videoRefresh()
                        })
                        item.appendChild(this.$refs.quality)
                    }
                }
            },
            playVideo() {
                this.refreshItem = false
                this.dp && this.dp.play()
            },
        },
        watch: {
            refresh(newVal) {
                console.log(newVal)
            },
            dp: {
                handler: function (newValue, old) {
                    if (newValue.paused) {
                        console.log('暂停', newValue.paused)
                        this.refreshItem = true
                        this.showPuse = true
                    } else {
                        this.refreshItem = false
                        this.showPuse = false
                    }
                    if (newValue.played) {
                        console.log('播放', newValue.played)
                    }
                },
                deep: true
            },
            showPuse(newValue, oldValue) {
                if (newValue) {
                    this.timeOut = false
                } else {
                    console.log('暂停后重新开始播放')
                    if (!this.firstLoad) {
                        this.videoRefresh()
                    }
                    this.firstLoad = false
                    this.timeOut = true
                    let that = this
                    clearTimeout(this.threeSecond)
                    this.threeSecond = setTimeout(function () {
                        that.timeOut = false
                    }, 2000)
                }
            },
        },
        beforeDestroy() {
            if (this.dp) {
                this.dp.destroy()
            }
        },
    }
</script>

<style lang="css">
    .showRefresh {
        color: #fff;
        text-align: center;
        line-height: 38px;
        font-size: 12px;
        width: 44px;
        height: 38px;
        position: absolute;
        left: 60px;
        bottom: 0px;
        cursor: pointer;
        background-image: url('../assets/images/icons/refresh.png');
        background-position: center;
        background-repeat: no-repeat;
        background-size: 35% 35%;
        transition: .3s;
    }
</style>
<style lang="scss" scoped>
    .video-box {
        height: 230px;
        background-color: #000;
    }

    .dplayer-danloading {
        display: none !important;
    }

    .dplayer-bezel-icon {
        display: none !important;
    }

    .imgBnner {
        position: absolute;
        top: 0;
        bottom: 0;
        width: 100%;
        height: 100%;
        z-index: 2;
    }

    .big-play-btn {
        position: absolute;
        width: 200px;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        margin: auto;
    }

    .video-player {
        position: relative;
        overflow: hidden;

        .play_img {
            position: absolute;
            top: 0;
            left: 0;
            bottom: 0;
            right: 0;
            margin: auto;
            z-index: 100;
        }

        .dplayer-full-cover {
            width: 40px;
            height: 40px;
            position: absolute;
            top: 0;
        }

        .control.ignore- {
            color: #fff;
            text-align: center;
            line-height: 38px;
            font-size: 12px;
            width: 40px;
            height: 38px;
            position: absolute;
            //right: 90px;
            left: 100px;
            bottom: 0px;
            z-index: 0;

            .control_box {
                width: 78px;
                height: 97px;
                position: absolute;
                bottom: 18px;
                left: -10px;

                .quality_list {
                    width: 78px;
                    height: 85px;
                    overflow: hidden;
                    display: block;
                    background: rgba(28, 28, 28, .9);
                    font-size: 12px;

                    & > span {
                        float: left;
                        display: block;
                        width: 100%;
                        height: 25px;
                        line-height: 25px;
                        background: rgba(28, 28, 28, .9);
                    }
                }
            }
        }
    }
    ::v-deep {
        .diplayer-loading-icon{
            background: url('../assets/images/live/loading.gif') no-repeat;
            background-size: 100% 100%;
            width: 100px;
            height: 100px;
            svg{
                display: none;
            }
        }
    }
</style>
