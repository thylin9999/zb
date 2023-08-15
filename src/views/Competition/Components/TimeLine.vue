<template>
    <div class="p-relative"
    :class="{
        'is-end': showPrev,
        'is-first': !showPrev
    }"
    >
        <div class="time-line p-relative">
            <div class="scroll-box overflow-x-auto" id="timeScrollBox">
                <ul
                    class="time-ul flex flex-no-wrap"
                    :style="scrollStyle"
                    :class="{
                        'is-end': showPrev,
                        'is-first': !showPrev
                    }"
                >
                    <li
                    class="time-item font-12 p-t-5 p-b-5 "
                    v-for="time in dates"
                    :key="time.date"
                    :class="{
                    'is-active': currentDate === time.date ,
                    'is-today': today === time.id,
                    ' not-today': today !== time.id
                    }"
                    @click="choseDate(time)"
                    >
                        <template v-if="today === time.id">
                            <div class="w-100 h-100 flex align-center justify-center">
                                <span class="d-inline-block text-center today font-12 font-500 font-medium">今天</span>
                            </div>
                        </template>
                        <div v-else class="flex-column h-100 font-regular justify-center flex align-center font-12">
                            <span class="date">{{ time.date }}</span>
                            <span class="weekday">{{ time.weekName }}</span>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
import { Calendar } from 'vant'
import dayjs from 'dayjs'
import { weekDay } from '../../../utils/utils'
const isoweek = require('dayjs/plugin/isoWeek')
export default {
    name: 'TimeLine',
    components: {
        [Calendar.name]: Calendar
    },
    props: {
        showPrev: {
            type: Boolean,
            default: false
        },
        showDaysNumber: {
            type: Number,
            default: 14
        },
        maxDate () {
            // return this.showPrev ? new Date() : null
            return new Date(2022, 10, 3)
        }
    },
    data () {
        return {
            showNumber: 14,
            times: [],
            currentDate: dayjs().format('MM-DD'),
            currentTime: '',
            today: dayjs().format('YYYY-MM-DD')
        }
    },
    computed: {
        dates () {
            // 赛程往后14天，赛果，往前 7天
            const dates = []
            if (!this.showPrev) {
                // 赛程
                for (let i = 0; i < this.showNumber; i++) {
                    const date = dayjs().add(i, 'day')
                    dates.push({
                        id: dayjs(date).format('YYYY-MM-DD'),
                        date: dayjs(date).format('MM-DD'),
                        week: dayjs(date).isoWeekday(),
                        weekName: weekDay[dayjs(date).isoWeekday()]
                    })
                }
            } else {
                for (let i = 0; i < this.showNumber; i++) {
                    const date = dayjs().subtract(i, 'day')
                    dates.unshift({
                        id: dayjs(date).format('YYYY-MM-DD'),
                        date: dayjs(date).format('MM-DD'),
                        week: dayjs(date).isoWeekday(),
                        weekName: weekDay[dayjs(date).isoWeekday()]
                    })
                }
            }
            // }
            return dates
        },
        timeRange () {
            if (this.dates && this.dates.length) {
                return {
                    minDate: new Date(this.dates[0].id),
                    maxDate: new Date(this.dates[this.dates.length - 1].id)
                }
            } else {
                return {}
            }
        },
        scrollBox () {
            return {
                // width: this.dates.length * 55 + 40
                // width: this.showPrev ? this.dates.length * 55 : (this.dates.length - 1) * 55
                width: (this.dates.length - 1) * 55
            }
        },
        scrollStyle () {
            return {
                width: this.scrollBox.width / 3.75 + 'vw'
            }
        }
    },
    created () {
        dayjs.extend(isoweek)
    },
    mounted () {
        if (this.showPrev) {
            this.$nextTick(() => {
                const el = document.getElementById('timeScrollBox')
                // const { width } = el.getBoundingClientRect()
                if (el) {
                    el.scrollLeft = this.dates.length * 55
                }
            })
        }
    },
    methods: {
        choseDate (time) {
            this.currentDate = time.date
            this.currentTime = time.id
            this.updateTime()
        },
        onConfirm (date) {
            this.currentDate = dayjs(date).format('MM-DD')
            this.currentTime = dayjs(date).format('YYYY-MM-DD')
            this.updateTime()
        },
        updateTime () {
            this.$emit('update:time', this.currentTime)
            this.$emit('refresh')
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/theme/default-vars.scss';
.time-line {
    margin: 0 auto;
    width: 300px;
    height: 54px;
    border-top: none;
    padding-top: 8px;
    position: relative;
    .time-item {
        width: 55px;
        height: 34px;
        .date {
            color: #6C73AF;
        }
        .weekday {
            color: #6C73AF;
        }
        &.is-active {
            .date, .weekday {
                color: #ffffff;
            }
            &.not-today{
                background: #FBA187;
                border-radius: 5px;
            }
        }
        &.is-today {
            position: absolute;
            .today {
                width: 41px;
                border-radius: 3px;
                line-height: 24px;
                color: #6C73AF;
            }
        }
        &.is-today.is-active {
            .today {
                background-color: #FBA187;
                color: #fff;
            }
        }
    }
    .time-ul {
        flex-wrap: nowrap;
        padding-right: 0;
        &.is-end {
            padding-left: 0;
            .is-today {
                right: -55px;
            }
        }
        &.is-first {
            .is-today {
                left: -55px;
            }
        }
    }
    .calender-button {
        right: 0;
        top: 0;
        width: 40px;
        background-color: $background-gray;
        box-shadow: -1px 0px 7px 0px rgba(151, 151, 151, 0.5);
        background-image: url('../../../assets/images/calender.png');
        background-size: 18px 18px;
    }
}
.is-end{
    .time-line{
        margin-right: 55px;
    }
}
.is-first{
    .time-line{
        margin-left: 55px;
    }
}
</style>
