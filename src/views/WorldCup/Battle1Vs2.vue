<template>
<div class="battle w-100 flex flex-wrap justify-center align-center">
    <template
        v-for="(group, groupKey) in  groupTeams"
    >
        <div
            class="PredictionBall2_list"
            :class="{
                'left-side': leftSides.includes(groupKey)
            }"
            :key="groupKey">
            <div class="PredictionBall2_listvs">VS</div>
            <div class="PredictionBall2_item  bg-center bg-size-100 bg-no-repeat"
                 v-for="(item, itemIndex) in group"
                 :key="item.id"
                 @click="choseTeam(item, groupKey, itemIndex)"
                 :class="{
                 'is-selected': item.isSelected,
             }"
            >
                <div class="PredictionBall_icon">
                    <img :alt="item.name"
                         :src="require(`../../assets/images/worldCup/teams/${item.img}.png`)"
                    >
                </div>
                <span>{{ item.name }}</span>
            </div>
        </div>
    </template>
</div>
</template>

<script>
import { mapState } from 'vuex'
import { getItem, setItem } from '@/utils/cookie'
import { groupChars } from '@/utils/utils'

export default {
    name: 'Battle1Vs2',
    data () {
        return {
            leftSides: [
                'A',
                'C',
                'E',
                'G'
            ],
            groupList: ['A/B', 'C/D'],
            groupTeams: {},
            stage4Res: {}
        }
    },
    created () {
        const stage4Res = getItem('stage4Res')
        this.stage4Res = stage4Res ? JSON.parse(stage4Res) : {}
        this.SET({ stage4Res: this.stage4Res })
        const isFull = Object.keys(this.stage4Res).length === 2
        this.$emit('update:canNextStep', isFull)
        this.initGroups()
    },
    computed: {
        ...mapState('commonData', ['stage3Res'])
    },
    methods: {
        initGroups () {
            // A /B , C/D  E/F G/H
            const selectIds = Object.keys(this.stage4Res).reduce((all, key) => {
                const item = this.stage4Res[key]
                all.push(item.id)
                return all
            }, [])
            this.groupTeams = this.groupList.reduce((all, item, index) => {
                const keys = item.split('/')
                const key1 = keys[0]
                const key2 = keys[1]
                const group1 = this.stage3Res[key1]
                const group2 = this.stage3Res[key2]
                const key = groupChars[index]
                all[key] = [
                    {
                        ...group1,
                        isSelected: selectIds.includes(group1.id)
                    },
                    {
                        ...group2,
                        isSelected: selectIds.includes(group2.id)
                    }
                ]
                return all
            }, {})
        },
        choseTeam (team, groupKey, itemIndex) {
            if (!team.isSelected) {
                // 之前的取消
                const optIndex = itemIndex === 0 ? 1 : 0
                this.groupTeams[groupKey][optIndex].isSelected = false
                team.isSelected = true
                this.stage4Res[groupKey] = team
            }
            setItem('stage4Res', JSON.stringify(this.stage4Res))
            this.SET({ stage4Res: this.stage4Res })
            const isFull = Object.keys(this.stage4Res).length === 2
            this.$emit('update:canNextStep', isFull)
        }
    }
}
</script>

<style lang="scss" scoped>
.battle {
    margin-bottom: 68px;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    flex: 2 1;
    width: 100%;
    margin-top: 12px;
}
.PredictionBall2_list {
    width: 351px;
    height: 208px;
    border-radius: 4px;
    background-color: #fff;
    display: flex;
    justify-content: space-around;
    align-items: center;
    margin-bottom: 12px;
    position: relative;
    background-repeat: no-repeat;
    background-size: 100% 100%;

    .PredictionBall2_listvs {
        font-family: PingFangSC;
        font-size: 16px;
        font-weight: 600;
        text-align: right;
        color: #8a1639;
        position: absolute;
        left: 47%;
        top: 47%;
    }
    }
    .PredictionBall2_item {
        font-family: PingFangSC;
        font-size: 14px;
        font-weight: 500;
        color: #9d9ea9;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 120px;
        height: 120px;

        &.is-selected {
            border: 2px solid #b70c3f!important;
            color: #b70c3f!important;
            border-radius: 4px;
            background-color: #ffeff4!important;
        }
        .PredictionBall_icon {
            width: 50px;
            height: 50px;
            border-radius: 50%;
            overflow: hidden;
            margin-bottom: 8px;
            display: flex;
            justify-content: center;
            align-items: center;
            border: 1px solid #eee;
            img {
                width: 85px;
                height: 85px;
            }
    }
}
</style>
