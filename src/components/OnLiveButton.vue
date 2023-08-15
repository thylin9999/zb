<template>
<div class="button bg-no-repeat">
    <span class="text-color">直播中</span>
    <slot/>
</div>
</template>

<script>
export default {
    name: 'OnLiveButton'
}
</script>

<style lang="scss" scoped>
.button {
    display: inline-block;
    background-image: url('../assets/images/common/live-white.gif');
    background-position: 3px center;
    background-size: 12px 14px;
}
</style>
