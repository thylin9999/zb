<template>
    <div class="box w-100 h-100">
        <div class="tabs w-100 m-b-10  flex align-center p-l-10 p-r-10 font-12 font-500 text-white">
            <span
                v-for="tab in tabs"
                :key="tab.id"
                class="flex-1 text-center p-relative tab-item"
                @click="setTab(tab)"
                :class="{
                    'is-active': currentTab === tab.id
                }"
            >{{  tab.label  }}</span>
        </div>
        <div class="body p-t-10 overflow-y-auto">
            <van-list
                v-model="loading"
                :finished="finished"
                @load="load"
                >
                <template v-if="lives.length">
                    <template
                        v-for="(row) in lives"
                    >
                        <div class="row  w-100 p-l-25 p-relative w-100 flex align-center" :key="row.id">
                            <IconPng class="p-absolute icon" icon="liveroom/dot" :width="10" :height="10"/>
                            <div class="content p-b-10 p-l-15  w-100 font-12 font-400 text-white">
                                <div class="header p-r-5 flex align-center justify-between">
                                    <span>{{ row.remainTime }}</span>
                                    <span class="font-14 ">{{ row.score }}</span>
                                </div>
                                <div class="font-12 m-t-5 description p-l-10 p-r-10 font-400 text-white">{{  row.content }}</div>
                            </div>
                        </div>
                    </template>
                </template>
                <NoData
                    class="flex flex-column align-center p-b-10"
                    v-if="!loading && !lives.length"
                    :width="180"
                    :height="170" />
            </van-list>
        </div>
    </div>
</template>

<script>
import { getTextLive } from '@/api/competition'
// import DynamicDot from '@/components/DynamicDot'
import { mapState } from 'vuex'
import { statusCode } from '@/utils/statusCode'
import NoData from '../../../../components/NoData.vue'
import IconPng from '../../../../components/IconPng'
import { List } from 'vant'
export default {
    name: 'TextLive',
    components: {
        // DynamicDot,
        NoData,
        [List.name]: List,
        IconPng
    },
    props: {
        matchId: {
            type: [Number, String],
            // default: 523978
            default: ''
        },
        matchInfo: {
            type: Object,
            default: () => ({})
        }
    },
    data () {
        return {
            list: [],
            lives: [],
            loading: false,
            finished: false,
            currentTab: 1,
            pagination: {
                total: 0,
                pageSize: 20,
                currentPage: 1
            }
        }
    },
    computed: {
        ...mapState('commonData', ['matchIcons']),
        isFootball () {
            return this.matchInfo && this.matchInfo.leagueType === 1
        },
        tabs () {
            const list = [
                {
                    id: 1,
                    label: '第一节'
                },
                {
                    id: 2,
                    label: '第二节'
                },
                {
                    id: 3,
                    label: '第三节'
                },
                {
                    id: 4,
                    label: '第四节'
                }
                // {
                //     id: 5,
                //     label: 'OT1'
                // },
                // {
                //     id: 6,
                //     label: 'OT2'
                // },
                // {
                //     id: 7,
                //     label: 'OT3'
                // }
            ]
            if (this.matchInfo.awayOT1 !== 0 && this.matchInfo.homeOT1 !== 0) {
                list.push({ id: 5, label: 'OT1' })
            }
            if (this.matchInfo.awayOT2 !== 0 && this.matchInfo.homeOT2 !== 0) {
                list.push({ id: 6, label: 'OT2' })
            }
            if (this.matchInfo.awayOT3 !== 0 && this.matchInfo.homeOT3 !== 0) {
                list.push({ id: 7, label: 'OT3' })
            }
            return list
        },
        quarter () {
            return this.tabs.find(x => x.id === this.currentTab)
        }
    },
    watch: {
        currentTab: {
            handler () {
                this.finished = false
                this.pagination.currentPage = 1
                this.lives = []
                this.init(true)
            }
        },
        matchId: {
            handler () {
                this.init(true)
            }
        }
    },
    methods: {
        load () {
            this.pagination.currentPage++
            this.init(false)
        },
        async init (init) {
            try {
                this.loading = true
                const { code, data } = await getTextLive(
                    this.matchId,
                    2,
                    (this.quarter && this.quarter.id) || 1,
                    this.pagination.currentPage,
                    this.pagination.pageSize
                )
                if (code === statusCode.success && data) {
                    const tempList = (data && data.list) || []
                    this.pagination.total = data && data.total
                    const list = tempList.reduce((all, item) => {
                        /*
                        * content
                        * id
                        * time
                        * */
                        // const icon = this.matchIcons.find(x => x.id === item.kind)
                        const time = item.content.split("'")[0]
                        all.push({
                            ...item,
                            matchTime: time
                        })
                        return all
                    }, [])
                    if (init) {
                        this.lives = list
                    } else {
                        this.lives = [].concat(this.lives, list)
                    }
                    this.finished = data.total === this.lives.length
                } else {
                    this.finished = true
                }
            } catch (e) {
                console.log(e, '出错了')
            } finally {
                this.loading = false
            }
        },
        setTab (tab) {
            this.currentTab = tab.id
        }
    }
}
</script>

<style lang="scss" scoped>
.body {
    height: calc(100% - 30px);
}
.lines {
    line-height: 17px;
    overflow-y: auto;
    .row {
        margin-bottom: 15px;
    }
    .time {
        left: -40px;
        &.is-basketball {
            left: -100px;
        }
    }
    .text-icon {
        width: 20px;
        height: 20px;
        background-image: url('../../../../assets/images/liveroom/text.png');
    }
    .end-icon {
        width: 20px;
        height: 20px;
    }
    .type{
        width: 15px;
        height: 15px;
    }
    .line {
        width: 1px;
        height: 30px;
        background-color: #D8D8D8;
        top: 40px;
        left: 10px;
    }
    .is-begin {
        .line {
            height: 20px;
            top: 25px;
        }
    }
    .content {
        width: 283px;
        height: 49px;
        border-radius: 3px;
        border: 1px solid #30366A;
    }
}
.tab-item{
    line-height: 17px;
    color: #6C73AF;
    &.is-active {
        color: #FBA187;
        &:after {
            content: '';
            position: absolute;
            width: 20px;
            height: 3px;
            background: #FBA187;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
        }
    }
}
.row {
    .content {
        border-left: 1px solid #D8D8D8;
        .description {
            line-height: 20px;
            padding: 3px 0;
            background: #30366A;
        }
    }
    .icon {
        left: 20px;
        top: -5px;
    }
    &:last-child {
        .content {
            border: none;
        }
    }
}
</style>
