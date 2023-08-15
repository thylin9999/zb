<template>
<div class="footer p-fixed w-100 ">
    <ul class="flex align-center h-100 ">
        <li
            v-for="menu in menus"
            :key="menu.key"
            class="flex flex-column flex-1  align-center p-relative bar-item"
            @click="goToPage(menu)"
            :class="{'is-active': activeId === menu.id }"
        >
            <icon-png
                :width="menu.width"
                :height="menu.height"
                :icon="activeId === menu.id ? menu.icon + '_h' : menu.icon" />
            <span class="bar-title font-12 font-500 font-regular">{{ menu.name }}</span>
        </li>
    </ul>
</div>
</template>

<script>
import IconPng from '@/components/IconPng'
export default {
    name: 'Footer',
    components: {
        IconPng
    },
    data () {
        return {
            menus: [
                {
                    id: 2,
                    name: '赛事',
                    width: 24,
                    height: 24,
                    key: 'Competition',
                    icon: 'footer/match'
                },
                {
                    id: 5,
                    name: '资讯',
                    width: 24,
                    height: 24,
                    key: 'News',
                    icon: 'footer/news'
                },
                {
                    id: 3,
                    name: '直播',
                    width: 24,
                    height: 24,
                    key: 'LiveList',
                    icon: 'footer/home'
                },
                {
                    id: 6,
                    name: '有料',
                    width: 24,
                    height: 24,
                    key: 'Guide',
                    icon: 'footer/guid'
                },
                {
                    id: 4,
                    name: '我的',
                    width: 24,
                    height: 24,
                    key: 'My',
                    icon: 'footer/my'
                }
            ],
            activeId: 1
        }
    },
    watch: {
        $route: {
            handler () {
                const icon = this.$route.meta.key
                if (icon) {
                    this.activeId = this.menus.find(x => x.key === icon).id
                }
            },
            immediate: true,
            deep: true
        }
    },
    methods: {
        goToPage (menu) {
            this.activeId = menu.id
            this.$router.push({
                name: menu.key
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.footer{
    left: 0;
    bottom: 0;
    z-index: 999;
    background-image: url('../../assets/images/footer/footer-bg.png');
    height: 65px;
    .bar-item {
        .bar-title {
            color: #7C7C7C;
            line-height: 16px;
        }
        &.is-active {
            .bar-title {
                color: #FBA187;
            }
        }
    }

}
::v-deep {
    .bar-item {
        .icon {
            width: 22px;
            height: 20px;
        }
    }

}
</style>
