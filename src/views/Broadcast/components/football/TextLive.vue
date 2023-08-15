<template>
    <div class="box w-100">
        <van-list
            v-model="loading"
            :finished="finished"
            @load="load"
            >
            <!-- <van-cell v-for="item in list" :key="item" :title="item" /> -->
            <template v-if="lives.length">
                <div class="row p-relative w-100 flex align-center is-begin">
                    <span
                        class="end-icon d-inline-block bg-size-100 bg-no-repeat bg-center"
                    >
                    <DynamicDot />
                    </span>
                    <span  class="line p-absolute d-inline-block"></span>
                </div>
                <template
                    v-for="(row, index) in lives"
                >
                    <div class="row p-relative w-100 flex align-center" :key="row.id">
                        <span
                            class="p-absolute time font-12 font-regular font-400 text-white"
                            :class="{
                                'is-basketball': !isFootball
                            }"
                        >{{ row.matchTime}}'</span>
                        <span
                            class="text-icon d-inline-block bg-size-100 bg-no-repeat bg-center"
                        ></span>
                        <div class="content p-l-10 m-l-15 flex align-center">
    <!--                    <span class="type d-inline-block bg-size-100 bg-no-repeat bg-center"-->
    <!--                          v-lazy:background-image="require(`../../../../assets/images/live-room/statics/${row.icon}.png`)"-->
    <!--                    ></span>-->
                            <div class="m-l-5 font-12 font-regular font-500 text-white">{{ row.content}}</div>
                        </div>
                        <span v-if="lives.length -1 !== index" class="line p-absolute d-inline-block"></span>
                    </div>
                </template>
            </template>
            <!-- <NoData
                class="flex flex-column align-center p-b-10"
                v-if="!loading && !lives.length"
                :width="180"
                :height="170" /> -->
        </van-list>

    </div>
</template>

<script>
import { getTextLive } from '@/api/competition'
import DynamicDot from '@/components/DynamicDot'
import { mapState } from 'vuex'
import { statusCode } from '@/utils/statusCode'
// import NoData from '../../../../components/NoData.vue'
import { List } from 'vant'
export default {
    name: 'TextLive',
    components: {
        DynamicDot,
        // NoData,
        [List.name]: List
    },
    props: {
        matchId: {
            type: [Number, String],
            default: null
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
        }
    },
    created () {
        this.init(true)
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
                    this.matchInfo.leagueType,
                    null,
                    this.pagination.currentPage,
                    this.pagination.pageSize
                )
                if (code === statusCode.success) {
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
                    this.finished = !data || data.total >= this.lives.length
                }
            } catch (e) {
                console.log(e, '出错了')
            } finally {
                this.loading = false
            }
        }
    }
}
</script>

<style lang="scss" scoped>
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
</style>
