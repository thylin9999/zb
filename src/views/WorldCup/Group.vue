<template>
<div class="group">
    <div class="PredictionBall_list">
        <div class="PredictionBall_lefts">组{{ groupName }}<br></div>
        <div class="PredictionBall_item bg-center bg-size-100 bg-no-repeat"
            v-for="item in groupTeams"
             :key="item.id"
             @click="choseTeam(item)"
             :class="{
                 'is-selected': item.isSelected,
                 'select-1': item.label === 1,
                 'select-2': item.label === 2,
                 'is-un-selected': !item.isSelected && isFulled
             }"
        >
            <div class="PredictionBall_icon">
                <img :alt="item.name" :src="require(`../../assets/images/worldCup/teams/${item.img}.png`)">
            </div>
            <span>{{ item.name }}</span>
        </div>
    </div>
</div>
</template>

<script>
import cloneDeep from 'lodash.clonedeep'
import { mapState } from 'vuex'
export default {
    name: 'Group',
    props: {
        group: {
            type: Array,
            default: () => []
        },
        groupName: {
            type: String,
            default: ''
        }
    },
    data () {
        return {
            groupTeams: [],
            chosedTeams: []
        }
    },
    created () {
        this.chosedTeams = cloneDeep(this.cacheList)
        this.groupTeams = cloneDeep(this.group).reduce((all, item) => {
            const cacheItem = this.cacheList.find(x => x.id === item.id)
            if (cacheItem) {
                all.push({ ...cacheItem })
            } else {
                all.push({
                    ...item,
                    isSelected: false,
                    label: null
                })
            }
            return all
        }, [])
    },
    computed: {
        ...mapState('commonData', ['stage1Res']),
        isFulled () {
            return this.chosedTeams.length > 1
        },
        cacheList () {
            return this.stage1Res[this.groupName] || []
        }
    },
    methods: {
        choseTeam (team) {
            if (this.chosedTeams.length === 2 && !team.isSelected) {
                return
            }
            if (team.isSelected) {
                team.isSelected = false
                team.label = null
                const index = this.chosedTeams.findIndex(x => x.id === team.id)
                this.chosedTeams.splice(index, 1)
            } else {
                const oldSelectTeams = this.chosedTeams.filter(x => x.isSelected)
                const _team = oldSelectTeams.length ? oldSelectTeams[0] : null
                team.isSelected = true
                team.label = _team ? (
                    _team.label === 1 ? 2 : 1
                ) : 1
                this.chosedTeams.push(team)
            }
            this.$emit('changeGroup', { key: this.groupName, res: this.chosedTeams })
        }
    }
}
</script>

<style lang="scss" scoped>
.PredictionBall_list {
    height: 68px;
    border-radius: 4px;
    background-color: #fff;
    position: relative;
    display: flex;
    justify-content: space-around;
    align-items: center;
    padding-left: 24px;
    margin-bottom: 14px;
    .PredictionBall_lefts {
        width: 24px;
        height: 68px;
        border-radius: 4px;
        background-color: #da285e;
        position: absolute;
        left: 0;
        top: 0;
        font-family: PingFangSC;
        font-size: 10px;
        text-align: center;
        color: #fff;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 10px;
    }
    .PredictionBall_item {
        font-family: PingFangSC;
        font-size: 10px;
        color: #9d9ea9;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 60px;
        height: 60px;

        .PredictionBall_icon {
            width: 24px;
            height: 24px;
            border-radius: 50%;
            overflow: hidden;
            margin-bottom: 8px;
            display: flex;
            justify-content: center;
            align-items: center;
            border: 1px solid #eee;
            img {
                height: 40px;
            }
        }

        &.is-selected {
            background-repeat: no-repeat;
            background-size: 100% 100%;
            color: #b70c3f!important;
        }
        &.select-1 {
            background-image: url('../../assets/images/worldCup/btn-guojia-1.png');
        }
        &.select-2 {
            background-image: url('../../assets/images/worldCup/btn-guojia-2.png');
        }
        &.is-un-selected {
            filter: opacity(50%);
            img {
                filter: grayscale(100%);
            }
        }
    }
}
</style>
