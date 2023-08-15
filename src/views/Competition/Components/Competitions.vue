<template>
    <div>
      <ul v-if="competitions.length" class="flex flex-wrap p-l-5 p-r-5">
        <template
            v-for="battle in competitions"
        >
          <competition-battle
              :battle="battle"
              :key="battle.id"
          />
        </template>
      </ul>
      <van-empty
          v-else
          class="custom-image"
          :image="require('../../../assets/images/notFound.png')"
          description="暂无数据"
      />
    </div>
</template>

<script>
import CompetitionBattle from '@/views/Competition/Components/CompetitionBattle'
import { getOnlineBroadcast } from '@/api/Host'
import { Toast, Empty } from 'vant'
import { statusCode } from '@/utils/statusCode'
// import { statusCode } from '@/utils/statusCode'
export default {
    name: 'Competitions',
    props: {
        params: {
            type: Object,
            default: () => ({})
        }
    },
    components: {
        [Toast.name]: Toast,
        [Empty.name]: Empty,
        CompetitionBattle
    },
    data () {
        return {
            competitions: []
        }
    },
    created () {
        this.fetchData()
    },
    methods: {
        async fetchData () {
            try {
                // Toast.loading({
                //     duration: 0,
                //     forbidClick: true
                // })
                this.$showLoading()
                const { data, code, msg } = await getOnlineBroadcast(this.params)

                if (code === statusCode.success) {
                    this.competitions = data ? data.list : []
                } else {
                    Toast(msg)
                }
            } finally {
                // Toast.clear()
                this.$hideLoading()
            }
        }
    }
}
</script>

<style scoped>

</style>
