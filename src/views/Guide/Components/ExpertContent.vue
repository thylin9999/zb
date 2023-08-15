<template>
    <div class="containe" @click="goDown">
        <expert-item v-for="item in list" :key="item.member_id" :item="item"></expert-item>
    </div>
</template>

<script>
import ExpertItem from './ExpertItem.vue'
import { getChoiceList } from '@/api/guide'
import { statusCode } from '@/utils/statusCode'

export default {
    components: {
        ExpertItem
    },
    data () {
        return {
            list: []
        }
    },
    mounted () {
        this.getChoiceListData()
    },
    methods: {
        async getChoiceListData () {
            const data = await getChoiceList()
            if (data.code === statusCode.success) {
                this.list = data.data
            } else {
                console.log('精选专家错误')
            }
        },
        goDown () {
            this.openDownloadDialog()
        }
    }
}
</script>

<style lang="scss" scoped>
.containe{
    width: 100%;
    height: 175px;
    background: url('../../../assets/images/guide/expertBg.png') no-repeat;
    background-size: 100% 100%;
    display: grid;
    grid-template-columns: repeat(5,1fr);
    flex-wrap: wrap;
    padding: 8px 10px;
}
</style>
