<template>
<div class="download-app" @click="goToService">

</div>
</template>

<script>
export default {
    name: 'DownloadApp',
    methods: {
        goToService () {
            // eslint-disable-next-line no-undef
            window.open(this._appDownloadUlr, '_blank')
        }
    }
}
</script>

<style lang="scss" scoped>
.download-app {
    height: calc(100vh - 70px);
    background-image: url('../assets/images/download.jpg');
    background-size: 100% 100%;
}
</style>
