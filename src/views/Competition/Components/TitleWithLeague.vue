<template>
<div class="row">
    <span class="league-title font-12 font-medium font-500 text-color ">热门联赛</span>
    <van-checkbox-group class="w-100" v-model="result" ref="checkboxGroup">
        <div class="flex m-t-15 align-center box flex-wrap">
            <div class="item p-l-5 flex align-center m-r-10 bg-white font-12 font-400 font-medium text-black-3" :key="league.leagueId" v-for="league in leagueTypes">
                <van-checkbox icon-size="14px" :name="league.leagueId">{{ league.nameChsShort}}</van-checkbox>
            </div>

        </div>
    </van-checkbox-group>
</div>
</template>

<script>
import { Checkbox, CheckboxGroup } from 'vant'
export default {
    name: 'TitleWithLeague',
    components: {
        [Checkbox.name]: Checkbox,
        [CheckboxGroup.name]: CheckboxGroup
    },
    props: {
        leagueTypes: {
            type: Array,
            default: () => []
        }
    },
    data () {
        return {
            result: []
        }
    }
}
</script>

<style lang="scss" scoped>
.league-title {
    padding: 2px 8px;
    height: 19px;
    background: #F5DEB3;
    border-radius: 0px 5px 5px 0px;
}
.box{
    width: 330px;
    margin: 0 auto;
}
.item {
    width: 100px;
    height: 26px;
    border-radius: 5px;
    margin-bottom: 3px;
}
//::v-deep {
//    .van-checkbox__icon.van-checkbox__icon--round {
//        font-size: 12px;
//    }
//    .van-checkbox__icon.van-icon {
//        height: 20px;
//        line-height: 20px;
//        &:before {
//            height: 20px;
//        }
//    }
//}
</style>
