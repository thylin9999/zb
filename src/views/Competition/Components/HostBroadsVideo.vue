<template>
    <div class=" host-box">
      <ul v-if="competitions.length" class="flex flex-wrap justify-center">
        <template
            v-for="competition in competitions"

        >
          <competition-card-video
              class="card"
              :key="competition.id"
              :competition="competition"
          />

        </template>
      </ul>
      <van-empty
          v-if="!isLoading && !competitions.length"
          class="custom-image"
          :image="require('../../../assets/images/notFound.png')"
          description="暂无数据"
      />
    </div>
</template>

<script>
import CompetitionCardVideo from '@/components/CompetitionCardVideo'
import { getLiveRoomApi } from '@/api/Host'
import { Toast, Empty } from 'vant'
import { statusCode } from '@/utils/statusCode'
export default {
    name: 'HostBroads',
    components: {
        [Toast.name]: Toast,
        [Empty.name]: Empty,
        CompetitionCardVideo
    },
    data () {
        return {
            competitions: [],
            isLoading: false
        }
    },
    created () {
        this.fetchData()
    },
    methods: {
        async fetchData () {
            try {
                this.isLoading = true
                // Toast.loading({
                //     duration: 0,
                //     forbidClick: true
                // })
                this.$showLoading()
                const { code, data, msg } = await getLiveRoomApi({
                    pageSize: 3,
                    pageNum: 1
                })
                if (code === statusCode.success) {
                    this.competitions = data ? data.list : []
                } else {
                    Toast(msg)
                }
            } finally {
                // Toast.clear()
                this.$hideLoading()
                this.isLoading = false
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.host-box{
    padding-left: 7px;
    padding-right: 2px;
    width: calc(100% - 10px);
    margin: auto;
    // .card{
    //     width: 30vw;
    //     height: 21.5vw;
    // }
}
</style>
