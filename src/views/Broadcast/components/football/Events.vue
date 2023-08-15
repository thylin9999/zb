<template>
    <div class="event-box p-t-30 p-b-30 h-100 overflow-y-auto">
        <div class="current-end row p-relative" v-if="showData.length">
            <span
                class="icon p-absolute d-inline-block bg-size-100 bg-no-repeat bg-center"
            >
              <DynamicDot />
            </span>

            <span class="line d-inline-block p-absolute"></span>
        </div>
        <template v-for="(event, index) in showData">
            <div
                class="row p-relative"
                :key="event.id"
            >
                <span class="time text-center p-absolute font-12 font-regular ">{{ event.time }}'</span>
                <div class="card p-5 p-absolute flex align-center"
                     :class="{
                        'is-right flex-reverse': event.isHome == 1,
                    }">
                    <span
                        v-if="event.icon"
                        class="icon d-inline-block m-l-5 m-r-5 bg-center bg-no-repeat bg-size-100"
                        v-lazy:background-image="require(`../../../../assets/images/liveroom/${event.icon}.png`)"
                    ></span>
                    <div class="content font-12 font-regular font-400 ">
                        <div class="up text-2-ellipsis font-medium text-white">{{ event.nameChs || '--'}}</div>
                        <div class="down font-regular text-white">{{ event.kind ? event.kind.name : '--' }}</div>
                    </div>
                </div>
                <span v-if="index !== showData.length -1 " class="line d-inline-block p-absolute"></span>
            </div>
        </template>
    </div>
</template>

<script>
import DynamicDot from '@/components/DynamicDot'
import { mapState } from 'vuex'
export default {
    name: 'FootballEvents',
    components: {
        DynamicDot
    },
    props: {
        events: {
            type: Array,
            default: () => ([])
        }
    },
    computed: {
        ...mapState('commonData', ['matchIcons']),
        showData () {
            return this.events.reduce((all, item) => {
                const icon = this.matchIcons.find(x => x.kind === item.kind)
                all.push({
                    ...item,
                    icon: icon && icon.id,
                    kind: icon.id
                })
                return all
            }, [])
        }
    },
    methods: {
        handleEvents (event) {
            let homeRed = 0
            let homeYellow = 0
            let awayRed = 0
            let awayYellow = 0
            this.events = event.reduce((all, item) => {
                const icon = this.matchIcons.find(x => x.id === item.kind)
                all.push({
                    ...item,
                    icon: icon && icon.icon,
                    kind: icon
                })
                if (item.kind * 1 === 2) {
                    // 红牌
                    // eslint-disable-next-line eqeqeq
                    if (item.isHome == 1) {
                        homeRed++
                    } else {
                        awayRed++
                    }
                } else if (item.kind * 1 === 3) {
                    // 黄牌
                    // eslint-disable-next-line eqeqeq
                    if (item.isHome == 1) {
                        homeYellow++
                    } else {
                        awayYellow++
                    }
                    // eslint-disable-next-line eqeqeq
                } else if (item.kind == 9) { // 两黄变红
                    // eslint-disable-next-line eqeqeq
                    if (item.isHome == 1) {
                        homeYellow++
                        homeRed++
                    } else {
                        awayYellow++
                        awayRed++
                    }
                }
                return all
            }, [])
            this.matchInfo.homeRed = homeRed
            this.matchInfo.homeYellow = homeYellow
            this.matchInfo.awayRed = awayRed
            this.matchInfo.awayYellow = awayYellow
        }
    }
}
</script>

<style lang="scss" scoped>
.event-box {
    width: 100%;
    margin: 0 auto;
}
.row {
    width: 50%;
    height: 55px;
    .time {
        width: 25px;
        line-height: 14px;
        color: #6C73AF;
        left: 140px;
        top: 0;
    }
    .card {
        width: 130px;
        background: #30366A;
        border-radius: 3px;
        .icon {
            width: 15px;
            height: 15px;
            flex-shrink: 0;
        }
        top: -22px;
        left: 170px;
        &.is-right{
            left: 0;
        }
        .content {
            line-height: 17px;
            color: #999;
        }
    }
    .line {
        width: 1px;
        height: 30px;
        top: 20px;
        left: 150px;
        background-color: #6C73AF;
    }
}
.current-end{
    .icon {
        left: 140px;
        top: -10px;
        width: 20px;
        height: 20px;
        //background-image: url('../../../../assets/images/live-room/statics/end.png');
    }
}
</style>
