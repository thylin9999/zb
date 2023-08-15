<template>
<div
    class="member p-absolute bg-no-repeat flex flex-column justify-between"
    :class="{
        'is-home': isHome
    }"
    :style="style"
>
    <span class="number text-white p-absolute font-14 font-500 font-medium">{{ member.number }}</span>
    <span class="w-100 name font-12 text-ellipsis text-center p-absolute font-medium font-500 text-white" >{{ member.nameChs}}</span>
</div>
</template>

<script>

export default {
    name: 'Member',

    props: {
        member: {
            type: Object,
            default: () => ({})
        },
        isHome: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        style () {
            return {
                transform: `translate(${this.member.position.x}px, ${this.member.position.y}px)`
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.member {
    width: 50px;
    height: 50px;
    left: 0;
    top: 0;
    background-image: url('../../../assets/images/liveroom/blue-flag.png');
    background-size: 30px 30px;
    background-position: top center;
    &.is-home {
        background-image: url('../../../assets/images/liveroom/red-flag.png');
    }
    .name {
        width: 100%;
        line-height: 20px;
        bottom: 0;
    }
    .number {
        left: 25px;
        top: 15px;
        transform: translate(-50% , -50%);
    }
}
</style>
