<template>
    <div class="p-t-10">
        <div class="row m-b-15 flex flex-column"
            v-for="item in showDatas"
            :key="item.event"
        >
            <div class="title font-12 font-400 text-white flex align-center justify-between">
                <span>{{ item.home_team }}</span>
                <span>{{ item.event }}</span>
                <span>{{ item.away_team }}</span>
            </div>
            <div class="bar flex align-center w-100">
                <div class="bar-item left-item">
                    <van-progress
                    class="w-100"
                    :percentage="item.homePercent"
                    color="#FF5B5D"
                    :show-pivot="false"/>
                </div>
                <div class="bar-item flex-1">
                    <van-progress
                    class="w-100"
                    :percentage="item.awayPercent"
                    color="#3DB1FB"
                    :show-pivot="false"/>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { percentToNum } from '../../../../utils/utils'
import { Progress } from 'vant'
export default {
    name: 'Statistic',
    components: {
        [Progress.name]: Progress
    },
    props: {
        statistics: {
            type: Object,
            default: () => ({})
        }
    },
    computed: {
        showDatas () {
            return Object.entries(this.statistics).reduce((all, [key, value]) => {
                const _key = key * 1
                if (![0, 3, 4, 14].includes(_key)) {
                    const homeVal = percentToNum(value.home_team) * 1 || 0
                    const awayVal = percentToNum(value.away_team) * 1 || 0
                    console.log(homeVal, awayVal)
                    const total = homeVal + awayVal
                    all.push({
                        ...value,
                        total,
                        homeVal,
                        awayVal,
                        homePercent: homeVal ? homeVal / total * 100 : '0',
                        awayPercent: awayVal ? awayVal / total * 100 : '0'
                    })
                }
                return all
            }, [])
        }
    }
}

</script>

<style lang="scss" scoped>
.row {
    .bar-item {
        width: 50%;
    }
    .title {
        line-height: 17px;
    }
    .left-item{
        transform: rotateY(180deg);
    }
}
</style>
