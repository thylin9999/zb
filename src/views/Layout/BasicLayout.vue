<template>
    <div class="h-100 basic-layout flex flex-column">
        <div class="header">
            <Header />
        </div>
        <div class="flex-1 content " >
            <router-view class="flex-1 overflow-y-auto"></router-view>
        </div>
    </div>
</template>
<script>
// import LeftMenu from './LeftMenu.vue'
// import Breadcrumb from './Breadcrumb.vue'
import Header from './Header.vue'
// import { mapState } from 'vuex'
// import { getItem } from '@/utils/cookie'

export default {
    name: 'BasicLayout',
    components: {
        Header
    }

}
</script>
<style lang="scss" scoped>
.content {
    padding-bottom: 50px;
    //width: calc(100% + 16px);
    // background: linear-gradient(180deg, #191E29 0%, #232A38 100%) #0E0E23;
}
</style>
