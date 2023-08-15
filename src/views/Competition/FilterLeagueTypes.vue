<template>
    <div class="page bg-gray">
        <van-nav-bar
            title="赛事筛选"
            left-arrow
            @click-left="closeFilter"
        />

        <div class="list p-t-10">
            <!-- <div class="tabs van-overflow-hidden  flex align-center">
                <span
                    class="tab font-medium font-14 font-500 flex-1 text-center bg-no-repeat bg-center bg-size-100"
                    :class="{
                        'is-active': leagueType === tab.id
                    }"
                    @click="changeLeagueType(tab)"
                    v-for="tab in tabs"
                    :key="tab.id"
                >{{ tab.label }}</span>
            </div> -->
            <div class="scroll-box m-t-15 overflow-y-auto">
                <van-checkbox-group
                    class="w-100"
                    v-model="result"
                    @change="changeSelect"
                    ref="checkboxGroup">
                    <div class="hot-leagues">
                        <span class="league-title font-12 font-medium font-500 text-white ">热门联赛</span>
                        <div class="flex m-t-15 align-center box flex-wrap">
                            <div
                                class="item p-l-5 flex align-center m-r-10 font-12 font-400 font-medium text-white"
                                :key="league.leagueId"
                                v-for="league in hotLeagues">
                                <van-checkbox icon-size="14px" :name="league.leagueId">{{ league.nameChsShort}}[{{ league.matchAmount }}]
                                    <template #icon="props">
                                        <img class="img-icon" :src="props.checked ? activeIcon : inactiveIcon" />
                                    </template>
                                </van-checkbox>
                            </div>
                        </div>
                    </div>
                    <div class="char-box">
                        <div class="content-box">
                            <template v-for="(arr, key) in showListFilter">
                                <div class="row m-t-15" :id="`section-${key}`" :key="key">
                                    <span class="league-title font-12 font-medium font-500 text-white ">{{ key }}</span>
                                    <div v-if="arr.length" class="flex m-t-15 align-center box flex-wrap" >
                                        <div
                                            class="item p-l-5 flex align-center m-r-10  font-12 font-400 font-medium text-white"
                                            :key="league.leagueId"
                                            v-for="league in arr">
                                            <van-checkbox
                                                icon-size="14px"
                                                :name="league.leagueId">{{ league.nameChsShort}}[{{ league.matchAmount }}]
                                                <template #icon="props">
                                                    <img class="img-icon" :src="props.checked ? activeIcon : inactiveIcon" />
                                                </template>
                                            </van-checkbox>
                                        </div>
                                    </div>
                                </div>
                            </template>
                        </div>

                    </div>
                </van-checkbox-group>
            </div>

        </div>
        <ul class="char-list text-center">
            <li
                v-for="char in labels"
                :key="char"
                @click="goToSection(char)"
                class="vertical-middle"
            >
                <span class="font-12 font-medium font-500">{{ char | filterChar}}</span>
            </li>
        </ul>
        <div class="footer-buttons text-white flex align-center justify-between">
            <span class="font-14 m-l-10 text-white">选中{{ selected }}/{{ total }}场</span>
            <van-radio-group class="" direction="horizontal" v-model="selectType" @change="toggleSelection">
                <van-radio @click="changeSingle" icon-size="15px" :name="1" shape="square">全选</van-radio>
                <van-radio icon-size="15px" :name="2" shape="square">反选</van-radio>
                <van-radio icon-size="15px" :name="3" shape="square">热门</van-radio>
            </van-radio-group>
            <span class="confirm text-color m-r-10 text-center font-medium font-500 d-inline-block" @click="confirm">确定</span>
        </div>
    </div>
</template>

<script>
import pinyin from 'pinyin'
import { Checkbox, CheckboxGroup, NavBar, RadioGroup, Radio, Toast } from 'vant'
import { getHotScheduleApi, getThreeLeagueType } from '@/api/competition'
import { statusCode } from '@/utils/statusCode'
import dayjs from 'dayjs'
export default {
    props: {
        leagueType: {
            type: Number,
            default: 1
        },
        leagueIds: {
            type: Array,
            default: () => []
        }
    },
    filters: {
        filterChar (char) {
            return char.toUpperCase()
        }
    },
    components: {
        [Checkbox.name]: Checkbox,
        [CheckboxGroup.name]: CheckboxGroup,
        [NavBar.name]: NavBar,
        [RadioGroup.name]: RadioGroup,
        [Radio.name]: Radio,
        [Toast.name]: Toast
    },
    data () {
        return {
            // leagueType: 1, // 足球
            tabs: [
                {
                    id: 1,
                    label: '足球联赛'
                },
                {
                    id: 2,
                    label: '篮球联赛'
                }
            ],
            list: [],
            showList: {},
            labels: [],
            result: [],
            hotLeagues: [],
            selectType: null, // 仅看热门
            activeIcon: require('@/assets/images/competition/checkIcon.png'), // 选中
            inactiveIcon: require('@/assets/images/competition/checkIcon1.png') // 未选中
            // ABC: ['A', 'B', 'C', 'D', 'E', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
        }
    },
    computed: {
        hotIds () {
            return this.hotLeagues.length && this.hotLeagues.reduce((all, item) => {
                all.push(item.leagueId)
                return all
            }, [])
        },
        total () {
            // return this.list.length + this.hotIds.length
            return this.list.length
        },
        selected () {
            // return this.result.length
            return Array.from(new Set(this.result)).length
        },
        hierarchyIds () {
            return this.list.reduce((all, item) => {
                all.push(item.leagueId)
                return all
            }, [])
        },
        showListFilter () {
            return Object.fromEntries(Object.entries(this.showList).filter(([_, item]) => {
                return item.length
            }))
        }
    },
    watch: {
        leagueType: {
            handler () {
                this.initLeagueTypes()
            },
            immediate: true
        },
        leagueIds: {
            handler () {
                this.result = this.leagueIds
            },
            immediate: true
        }
    },
    methods: {
        changeSingle (e) {
            console.log(e, 'asf')
        },
        async initLeagueTypes () {
            await this.getHotLeagueTypes()
            // this.getThreeLeagueType()
            if (!this.leagueIds.length) this.toggleSelection(4) // 首次进来默认选中全部联赛
        },
        async getThreeLeagueType () {
            Toast.loading({
                duration: 0,
                forbidClick: true
            })
            try {
                const { data, code } = await getThreeLeagueType(this.leagueType)
                if (code === statusCode.success) {
                    // this.list = (data && data.slice(0, 30)) || []
                    this.list = data || []
                    this.handleData()
                }
            } catch (e) {
                console.log('出粗了')
            } finally {
                Toast.clear()
            }
        },
        async getHotLeagueTypes () {
            const jsonData = {
                league_type: this.leagueType,
                day: dayjs().format('YYYY-MM-DD'),
                hierarchy: '1,2,3'
            }
            try {
                const { data, code } = await getHotScheduleApi(jsonData)
                if (code === statusCode.success) {
                    // 热门联赛筛选 1，2=热门。1，2，3=全部
                    this.hotLeagues = data.filter(x => x.hierarchy !== 3) || []
                    // this.result = this.hotIds
                    // 按字母排序用1，2，3的全部数据
                    this.list = data
                    this.handleData()
                }
            } catch (e) {
                console.log('出错了')
            } finally {
                this.$hideLoading()
            }
        },
        handleData () {
            const label = 'abcdefghijklmnopqrstuvwxyz'
            this.labels = label.split('')
            const list = this.labels.reduce((all, key) => {
                const tempKey = key.toUpperCase()
                all[tempKey] = []
                return all
            }, {})
            this.showList = this.list.reduce((all, item) => {
                const key = pinyin(item.nameChsShort, { style: 'FIRST_LETTER' })[0][0].charAt(0).toUpperCase()
                all[key].push(item)
                return all
            }, { ...list })
        },
        goToSection (char) {
            try {
                const id = 'section-' + char.toUpperCase()
                console.log(id, 'id')
                const el = document.getElementById(id)
                el.scrollIntoView({
                    behavior: 'smooth'
                })
            } catch (e) {
                console.log('没有该选项')
            }
        },
        toggleSelection (type) {
            console.log(type, 'asdf')
            if (type === 3) {
                // 热门
                this.result = this.hotIds
            } else if (type === 4) {
                // 全选
                this.result = this.list.reduce((all, item) => {
                    all.push(item.leagueId)
                    return all
                }, [])
            } else if (type) {
                type === 1
                    ? this.$refs.checkboxGroup.toggleAll(true)
                    : this.$refs.checkboxGroup.toggleAll()
            }
        },
        closeFilter () {
            this.$emit('closeFilter')
        },
        changeLeagueType (tab) {
            this.leagueType = tab.id
        },
        isHot (names, hots) {
            const x = new Set(names)
            const y = new Set(hots)
            const l = new Set([...x, ...y]).size
            return x.size === y.size && x.size === l
        },
        changeSelect (names) {
            console.log(names, 'asdf')
            // 如果符合仅热门
            if (this.isHot(names, this.hotIds)) {
                this.selectType = 3
            } else {
                // 是否全选
                if (names.length === this.hotIds.length + this.showList.length) {
                    this.selectType = 1
                    return
                }
                if (this.selectType === 3) {
                    this.selectType = null
                }
            }
        },
        confirm () {
            this.$emit('update:leagueIds', this.result)
            const hasThreeLeagues = this.result.some((id) => this.hierarchyIds.includes(id))
            this.$emit('update:hasThreeLeagues', hasThreeLeagues)
            this.closeFilter()
        }
    }
}
</script>
<style lang="scss" scoped>
.page {
    height: 100vh;
    width: 100vw;
    left: 0;
    top: 0;
    z-index: 1000;
}
.list {
    width: 100%;
    height: calc(100vh - 46px);
    background-color: #0E0E23;
}

.tabs {
    width: 180px;
    height: 30px;
    margin: 0 auto;
    line-height: 30px;
    border-radius: 15px;
    .tab {
        color: #999;
        &.is-active {
            color: #333;
            background-image: url("../../assets/images/common/active-bg.png");
        }
    }
}
.scroll-box{
    height: calc(100% - 45px);
    padding-bottom: 60px;
}
.char-list{
    top: calc(50vh - 185px);
    right: 10px;
    position: fixed;
    width: 15px;
    li {
        height:15px;
        line-height: 15px;
        color: #999;
    }
}
.char-box {
    position: relative;
    .content-box {
        text-align: left;
        display: flex;
        flex-direction: column;
    }
}
.footer-buttons{
    width: 100%;
    position: fixed;
    height: 75px;
    bottom: 0;
    left: 0;
    background-color: #2B1446;
    padding-top: 10px;
    padding-bottom: 25px;
    .confirm {
        font-size: 13px;
        width: 70px;
        height: 28px;
        background: #FBA187;
        border-radius: 3px;
        line-height: 28px;
    }
}

.scroll-box {
    .league-title {
        padding: 2px 8px;
        height: 19px;
        background: #FBA187;
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
        background-color: #161C4F;
    }
}
::v-deep {
    .van-check {
        line-height: 30px;
        height: 30px;
    }
    .van-checkbox__label, .van-radio__label{
        color: #fff;
    }

    .footer-buttons{
        .van-radio__icon {
            display: none;
        }
        .van-radio {
            width: 55px;
            height: 26px;
            background: #30366A;
            border-radius: 4px;
            justify-content: center;
            font-size: 12px;
            .van-radio__label {
                color: #6C73AF;
                margin: 0;
            }

        }
        .van-radio--horizontal {
            margin-right: 4px;
        }
    }
    .van-checkbox__label{
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }
}
</style>
