<template>
    <div class="w-100 p-t-5 flex align-center flex-wrap box">
        <div
            v-for="item in matchIcons"
            :key="item.id"
            class="flex align-center m-t-10 item p-l-15"
        >
            <IconPng
                :icon="`liveroom/${item.id}`"
                :width="15"
                :height="15"
            />
            <span class="font-12 label text-primary font-400">{{  item.label  }}</span>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex'
import IconPng from '@/components/IconPng'
export default {
    name: 'IconWithLabel',
    components: {
        IconPng
    },
    computed: {
        ...mapState('commonData', ['matchIcons'])
    }
}

</script>

<style lang="scss" scoped>
.box {
    background-color:#2B1845;
    padding-bottom: 35px;
}
.item {
    width: 25%;
    .label {
        margin-left: 2px;
    }
}
</style>
