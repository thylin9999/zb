<template>
    <div>
        <div :id="`svga${id}`" :class="{wh100: width === 100, position: width === 100, fullscreen: width !== 100}" class="svga"></div>
    </div>
</template>

<script>
import SVGA from 'svgaplayerweb'

export default {
    name: 'CommonSvag',
    props: {
        url: {
            type: String,
            default: ''
        },
        id: { // 多个svga创建，需要唯一id值
            type: Number,
            default: 0
        },
        width: {
            type: [String, Number],
            default: 0
        },
        height: {
            type: [String, Number],
            default: 0
        }
    },
    data () {
        return {
            player: null
        }
    },
    mounted () {
        this.$nextTick(() => {
            console.log('chuangjian', this.id)
            this.init()
        })
        this.$bus.$on(`stopSvgaPlayer${this.id}`, () => { // 动画结束的时候，清除动画
            try {
                // console.log('xiaohui', this.id)
                this.player.stopAnimation()
                this.player.clear()
                this.player = null // 不赋值为null，内存不会释放
            } catch (e) {
                console.log('无销毁')
            }
        })
    },
    methods: {
        init () {
            const self = this
            self.player = new SVGA.Player(`#svga${self.id}`)
            const parser = new SVGA.Parser(`#svga${self.id}`)
            parser.load(self.url, function (videoItem) {
                self.player.setVideoItem(videoItem)
                self.player.startAnimation()
            })
        }
    },
    beforeDestroy () {
        try {
            this.player.stopAnimation()
            this.player.clear()
            this.player = null // 不赋值为null，内存不会释放
            // console.log('xiaohui:', this.id)
        } catch (e) {
            console.log('无销毁')
        }
    }
}
</script>

<style lang="scss" scoped>
    .svga{
        margin: 0 auto;
    }
    .position{
        margin-top: -20px;
        margin-left: -21px;
    }
    .wh100{
        width: 100px;
        height: 100px;
    }
    .wh60{
        width: 60px;
        height: 60px;
    }
    .fullscreen{
        width: 375px;
        height: 375px;
    }
</style>
