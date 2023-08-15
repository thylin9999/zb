<template>
    <div class="w-100 recomNews">
        <div class="title w-100 p-l-15 p-r-15">
            相关资讯
        </div>
        <ul class="w-100">
            <li
                class="w-100 m-t-5"
                v-for="news in otherNews"
                :key="news.id"
                @click="goToDetail(news)"
            >
                <card class="flex align-center" :info="news" />
            </li>
        </ul>
    </div>
</template>

<script>
import { getOtherNews } from '../../api/common'
import { statusCode } from '../../utils/statusCode'
import Card from './Card.vue'
export default {
    name: 'RecommendNews',
    components: {
        Card
    },
    props: {
        id: {
            type: Number,
            default: null
        }
    },
    data () {
        return {
            otherNews: []
        }
    },
    created () {
        this.fetchOtherNews()
    },

    methods: {
        async fetchOtherNews () {
            try {
                const { code, data } = await getOtherNews(this.id)
                if (code === statusCode.success) {
                    this.otherNews = data
                }
            } catch (e) {
                console.log(e, '出错了')
            }
        },
        goToDetail (news) {
            this.$router.push({
                name: 'NewsDetail',
                params: {
                    id: news.id
                }
            })
        }
    }
}

</script>

<style lang="scss" scoped>
.title {
    height: 33px;
    line-height: 33px;
    background: linear-gradient(90deg, #FFF5E8 0%, #E1A579 100%);
    border-radius: 5px;
    color: #E2A67B;
}
.recomNews{
    padding-bottom: 50px;
}
</style>
