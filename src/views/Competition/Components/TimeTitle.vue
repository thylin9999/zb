<template>
<div class="line w-100 font-12 font-medium font-500 p-l-10">
    <span>{{ date }}</span>
    <span class="m-l-5">{{ week }}</span>
</div>
</template>

<script>
import dayjs from 'dayjs'
import isoWeek from 'dayjs/plugin/isoWeek'
import { weekDay } from '@/utils/utils'

export default {
    name: 'TimeTitle',
    props: {
        date: {
            type: String,
            default: '9月3日'
        }
    },
    computed: {
        week () {
            return weekDay[dayjs(this.date).isoWeekday()]
        }
    },
    created () {
        dayjs.extend(isoWeek)
    }
}
</script>

<style lang="scss" scoped>
.line{
    line-height: 20px;
    height: 20px;
    color: #A9833E;
    background: linear-gradient(90deg, #F5DEB3 0%, #F8F8F8 100%);
}
</style>
