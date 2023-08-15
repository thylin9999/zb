<template>
  <div class="book-matches p-t-10">
    <div class="block w-100 flex justify-between align-center" v-if="list.length">
        <div class="overflow-x-auto match-box">
            <div class="match-list p-t-5 p-b-5 flex align-center flex-no-wrap">
            <match-card
                class="m-r-5"
                v-for="match in list"
                :key="match.id"
                :match="match"
                @refresh="fetchData"
            />
            </div>
        </div>
        <div class="view-more flex align-center justify-center bg-center bg-no-repeat bg-size-100">
                <span
                    class="font-12 font-medium"
                    @click="viewMore"
                >全部赛程</span>
        </div>
    </div>
    <!-- 骨架 -->
    <div class="shelf-box" v-else-if="shelf && !list.length">
        <div class="shelf" v-for="i in shelf" :key="i">
            <p></p>
            <p></p>
            <p></p>
        </div>
    </div>
  </div>
</template>

<script>
import { getHotMatches } from '@/api/competition'
import MatchCard from '@/components/MatchCard'
import { Toast } from 'vant'
import dayjs from 'dayjs'
import { statusCode } from '@/utils/statusCode'
import { matchStatus } from '@/utils/utils'

export default {
    name: 'BookedMatches',
    components: {
        MatchCard,
        [Toast.name]: Toast
    },
    data () {
        return {
            list: [],
            shelf: 2
        }
    },
    created () {
        this.fetchData()
    },
    methods: {
        async fetchData () {
            try {
                const { data, code, msg } = await getHotMatches({
                    day: dayjs().format('YYYY-MM-DD')
                })
                if (code === statusCode.success) {
                    this.list = data.list.reduce((all, match) => {
                        all.push({
                            ...match,
                            isSubscribe: match.appointment * 1 === 1,
                            isGoing: !matchStatus[match.state]
                        })
                        return all
                    }, [])
                } else {
                    Toast(msg)
                }
            } catch (e) {
                console.log('出错了')
            } finally {
                this.shelf = false
            }
        },
        viewMore () {
            this.$router.push({
                name: 'Competition'
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.book-matches {
  font-size: 15px;
  position: relative;
    .block {
        padding-left: 15px;
        padding-right: 15px;
    }
  .hot-recommend {
    line-height: 22px;
    height: 22px;
    .tv-icon {
      width: 17px;
      height: 17px;
      background-image: url('../assets/images/icons/tv.png');
    }
    .match-icon {
      width: 17px;
      height: 17px;
      background-image: url('../assets/images/icons/match.png');
    }
  }
  .match-box {
    overflow-y: hidden;
    //width: calc(100% - 50px);
  }
}
.match-list {
    width: fit-content;
    padding-left: 1px;
    padding-right: 1px;
}
.view-more {
  width: 25px;
  height: 90px;
  background: linear-gradient(180deg, #6F4E5E 0%, #161147 100%);
  box-shadow: 0px 0px 3px 0px rgba(15,85,153,0.2200);
  border-radius: 3px;
  position: absolute;
  top: 15px;
  right: 13px;
  z-index: 2;
  font-size: 8px;
  color: #ffffff;
  font-weight: 300;
  span {
    display: block;
    line-height: 16px;
    letter-spacing: 5px;
    width: 12px;
  }
}
.shelf-box{
    display: grid;
    grid-template-columns: repeat(2,1fr);
    grid-gap: 0.5rem;
    padding:0 15px 0 15px;
}
.shelf{
    width: 157px;
    height: 90px;
    background: #161C4F;
    box-shadow: 0px 0px 4px 0px rgba(15,85,153,0.22);
    border-radius: 5px;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    padding-left: 8px;
    p:nth-child(1){
        width: 141px;
        height: 17px;
        background: #6C73AF;
        border-radius: 3px;
    }
    p:nth-child(2),p:nth-child(3){
        width: 79px;
        height: 17px;
        background: #6C73AF;
        border-radius: 3px;
    }

}

@media screen and (min-width: 330px) {
    .view-more{
        span{
            letter-spacing: 0;
        }
    }
}
</style>
