<template>
<div class="w-100 h-100">
    <iframe class="w-100 h-100" :src="iframeUrl" frameborder="0"></iframe>
</div>
</template>

<script>
export default {
    name: 'Index',
    data () {
        return {
            // eslint-disable-next-line no-undef
            iframeUrl: _eventUrl
        }
    }
}
</script>

<style lang="scss" scoped>
::v-deep {
    .vue-friendly-iframe {
        width: 100%;
        height: 100%;
    }
}
</style>
