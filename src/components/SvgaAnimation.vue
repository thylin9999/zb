<template>
<div id="svgContainer" ref="demoCanvas"></div>
</template>

<script>
import SVGA from 'svgaplayerweb'
export default {
    name: 'SvgaAnimation',
    components: {
    },
    data () {
        return {

        }
    },
    mounted () {
        this.initMachineSVGA()
    },
    methods: {
        initMachineSVGA () {
            const player = new SVGA.Player('#svgContainer')
            const parser = new SVGA.Parser('#svgContainer')
            // 必须是服务器地址或者是线上的地址本地是不可以的 会报错
            parser.load('/aaa/svga/666.svga', function (videoItem) {
                console.log(videoItem, 'asdf')
                player.setVideoItem(videoItem)
                player.startAnimation()
            })
        }
    }
}
</script>
