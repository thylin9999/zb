<template>
    <div class=" host-box w-100">
      <ul v-if="competitions.length" class="flex flex-wrap">
        <template
            v-for="competition,index in competitions"
        >
          <competition-card
              :key="competition.id"
              :competition="competition"
              :index="index"
              :showTag="true"
          />

        </template>
      </ul>
      <div class="shelf-box" v-else-if="shelf && !competitions.length ">
            <div class="shelf" v-for="i in shelf" :key="i">
                <p></p>
                <div>
                    <p></p>
                    <div>
                        <p></p>
                        <p></p>
                    </div>
                </div>
            </div>
      </div>
      <van-empty
          v-if="!isLoading && !competitions.length && !shelf"
          class="custom-image"
          :image="require('../../../assets/images/notFound.png')"
          description="暂无数据"
      />
    </div>
</template>

<script>
import CompetitionCard from '@/components/CompetitionCard'
// import { getHotRoom } from '@/api/competition'
import { getLiveRoomApi } from '@/api/Host'
import { Toast, Empty } from 'vant'
import { statusCode } from '@/utils/statusCode'
export default {
    name: 'HostBroads',
    components: {
        [Toast.name]: Toast,
        [Empty.name]: Empty,
        CompetitionCard
    },
    data () {
        return {
            competitions: [],
            isLoading: false,
            shelf: 6
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
                    pageSize: 2000,
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
                this.shelf = false
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.host-box{
    padding-left: 14px;
    padding-right: 14px;
    //width: calc(100% - 10px);
    >ul{
        padding-bottom: 45px;
    }
}
.shelf-box{
    width: 100%;
    display: grid;
    grid-template-columns: repeat(2,1fr);
    grid-gap: 0.5rem;
}
.shelf{
    width: 170px;
    height: 130px;
    background: #161C4F;
    border-radius: 3px 3px 0px 0px;
    >p:nth-child(1){
        width: 100%;
        height: 98px;
        background: #6C73AF;
        border-radius: 3px 3px 0px 0px;
    }
    >div{
        display: flex;
        padding-top: 4px;
        padding-left: 4px;
        >p:nth-child(1){
            width: 24px;
            height: 24px;
            background: #6C73AF;
            border-radius: 50%;
            margin-right: 4px;
        }
        div{
            p:nth-child(1){
                width: 125px;
                height: 10px;
                background: #6C73AF;
                border-radius: 3px;
                margin-bottom: 4px;
            }
            p:nth-child(2){
                width: 59px;
                height: 10px;
                background: #6C73AF;
                border-radius: 3px;
            }
        }
    }
}
</style>
