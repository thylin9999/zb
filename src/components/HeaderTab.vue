<template>
<div class="tab-box">
    <ul class="tabs w-100 flex align-center justify-around" >
        <li
            class="item font-12 font-medium"
            v-for="type in matchTypes"
            :key="type.id"
            :class="{'is-active': currentTab === type.id}"
            @click="changeTab(type)"
        >
            {{ type.title }}
        </li>
    </ul>
</div>
</template>

<script>
import { mapState } from 'vuex'
export default {
    name: 'HeaderTab',
    props: {
        tabId: {
            type: Number,
            default: 1
        }
    },
    computed: {
        ...mapState('commonData', ['matchTypes'])
    },
    data () {
        return {
            currentTab: 1
        }
    },
    created () {
        this.currentTab = this.tabId
    },
    methods: {
        changeTab (type) {
            this.currentTab = type.id
            this.$emit('update:tabId', this.currentTab)
        }
    }
}
</script>

<style lang="scss" scoped>
.tab-box{
    margin: 0 auto;
    background: linear-gradient(180deg, #F0F2FF 0%, #D0D6FF 100%);
    border-radius: 16px;
    width: 355px;
    line-height: 30px;
    .item {
        color: #656565;
        &.is-active {
            font-size: 18px;
            color: #0F2163;
        }
    }
}
</style>
