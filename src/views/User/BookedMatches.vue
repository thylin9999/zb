<template>
    <div class="bg-gray h-100">
        <van-nav-bar
            title="我的预约"
            left-arrow
            @click-left="onClickLeft"
        />
        <div class="hosts bg-gray p-t-10">
            <div class="p-l-5">
                <competition-battle
                    v-for="battle in list"
                    :battle="battle"
                    :key="battle.id"
                    @refresh="fetchData"
                />
            </div>
        </div>
    </div>
</template>

<script>
import { NavBar } from 'vant'
import { getBookedMatches } from '@/api/competition'
import { statusCode } from '@/utils/statusCode'
import CompetitionBattle from '@/views/Competition/Components/CompetitionBattle'
export default {
    name: 'BookedMatches',
    components: {
        [NavBar.name]: NavBar,
        CompetitionBattle
    },
    data () {
        return {
            list: []
        }
    },
    created () {
        this.fetchData()
    },
    methods: {
        async fetchData () {
            const { data, code } = await getBookedMatches()
            if (code === statusCode.success) {
                this.list = data ? data.list.reduce((all, item) => {
                    item.appointment = 1
                    all.push({
                        ...item,
                        isSubscribe: item.status === 1
                    })
                    return all
                }, []) : []
            }
        },
        onClickLeft () {
            this.$router.go(-1)
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/theme/default-vars.scss';
.hosts {
    height: calc(100% - 46px);
    overflow-y: overlay;
}
::v-deep {
    .host .card:last-child {
        border-bottom: none!important;
    }
}
</style>
