<template>
    <div class="page h-100 w-100">
        <template>
            <component
                :is="compName"
                :match-id="matchId"
            />
        </template>
        <!-- <NoData class="flex align-center flex-column" v-else /> -->
    </div>
</template>

<script>
import BasketballStatus from './BasketballStatus.vue'
import FootballStatus from './FootballStatus.vue'
import NoData from '@/components/NoData'
export default {
    name: 'CompetitionResult',
    props: {
        leagueType: {
            type: [Number, String],
            default: null
        },
        roomInfo: {
            type: Object,
            default: () => ({})
        }
    },
    components: {
        BasketballStatus,
        FootballStatus,
        NoData
    },
    computed: {
        matchId () {
            return this.roomInfo.match_id
        },
        hasMatch () {
            return this.leagueType !== -1
        },
        isFootball () {
            return this.leagueType === 1
        },
        isBasketball () {
            return this.leagueType === 2
        },
        compName () {
            return this.isFootball
                ? 'FootballStatus'
                : (this.isBasketball ? 'BasketballStatus' : null)
        }
    }
}

</script>
