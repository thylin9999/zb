<template>
<div class="h-100">
    <template v-if="lineupData">
        <FootballLineup
            class="h-100"
            v-if="isFootball && lineupData"
            :room-info="roomInfo"
            :lineup-data="lineupData"
        />
        <BasketballLineup
            class="h-100"
            v-if="!isFootball && lineupData"
            :room-info="roomInfo"
            :lineup-data="lineupData"
            :match-id="matchId"
        />
    </template>
    <NoData class="flex align-center flex-column" v-else/>

</div>
</template>

<script>
import { getLineup } from '@/api/competition'
import { statusCode } from '@/utils/statusCode'
// import ExpandList from '@/components/ExpandList'
import FootballLineup from './football/Lineup.vue'
import BasketballLineup from './basketball/Lineup.vue'
import NoData from '../../../components/NoData.vue'
export default {
    name: 'Lineup',
    components: {
        // ExpandList,
        FootballLineup,
        BasketballLineup,
        NoData
    },
    props: {
        roomInfo: {
            type: Object,
            default: () => ({})
        },
        leagueType: {
            type: [Number, String],
            default: null
        }
    },
    data () {
        return {
            lineupData: null,
            tabs: []
        }
    },
    computed: {
        matchId () {
            return this.roomInfo.match_id
        },
        hasMatch () {
            return this.leagueType !== -1
        },
        isFootball () {
            return this.leagueType === 1 && this.hasMatch
        }
    },
    created () {
        if (this.matchId) {
            this.fetchData()
        }
    },
    methods: {
        async fetchData () {
            try {
                const { data, code } = await getLineup(this.isFootball ? 'football' : 'basketball', this.matchId)
                if (code === statusCode.success) {
                    this.lineupData = data
                    this.tabs = [
                        {
                            id: 1,
                            name: this.lineupData.homeCoachCn
                        },
                        {
                            id: 2,
                            name: this.lineupData.awayCoachCn
                        }
                    ]
                }
            } catch (e) {
                console.log('出错了')
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.tab-item {
    line-height: 45px;
    height: 45px;
    color: #999;
    &.is-active {
        color: #4164FF;
    }
}
</style>
