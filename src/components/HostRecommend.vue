<template>
<div class="w-100">
    <div class="header flex align-center text-gray1">
        <IconCom icon="favorite" :width="20" :height="20"/>
        <span class="font-16 m-l-5 text-gray1 d-inline-block font-medium font-500">推荐主播</span>
    </div>
    <div class="list m-t-10 w-100 overflow-x-auto ">
        <ul class="flex" :style="ulStyle">
            <li
                v-for="host in hosts"
                :key="host.id"
                class="host-li   w-100 bg-white"
                @click="goToLiveRoom(host)"
            >
                <div class="flex w-100 host-item flex-column text-gray1 font-12 font-regular font-15">
                    <div class="flex w-100 align-center">
                        <div class="avatar bg-center bg-no-repeat bg-size-cover"
                             :style="{
                                backgroundImage:  `url(${host.logo})`
                            }"
                        >
                            <div
                                v-if="host.live_status === 2"
                                class="icon w-100 h-100 "
                            ></div>
                        </div>
                        <div class="font-12 host-name m-l-5 flex-1 flex flex-column">
                            <span class="text-black-3 d-inline-block text-ellipsis font-medium  font-500">{{ host.anchor_name}}</span>
                            <span class="scale-9 d-inline-block text-ellipsis font-regular font-400">{{ host.leagueChsShort }}</span>
                        </div>
                    </div>
                    <div v-show="host.live_status === 2 && host.homeChs && host.awayChs" class="font-12 m-t-5 font-regular font-400 text-ellipsis">
                        <span>{{ host.homeChs}}</span>
                        <span class="m-l-5 m-r-5">VS</span>
                        <span>{{ host.awayChs}}</span>
                    </div>
                </div>
            </li>
        </ul>
    </div>
</div>
</template>

<script>
import { getHostList } from '@/api/Host'
import IconCom from '@/components/IconCom'
import { statusCode } from '@/utils/statusCode'
export default {
    name: 'HostRecommend',
    components: {
        IconCom
    },
    data () {
        return {
            hosts: []
        }
    },
    created () {
        this.fetchData()
    },
    computed: {
        ulStyle () {
            return {
                width: this.hosts.length * 125 - 15 + 'px'
                // width: 30 * 135 - 15 + 'px'
            }
        }
    },
    methods: {
        async fetchData () {
            try {
                const { data, code, msg } = await getHostList(2)
                if (code === statusCode.success) {
                    this.hosts = data || []
                } else {
                    console.log(msg)
                }
            } catch (e) {
                console.log('出凑了')
            }
        },
        goToLiveRoom (host) {
            if (host.live_status !== 2) return
            this.$router.push({
                name: 'Broadcast',
                params: {
                    id: host.match_id
                },
                query: { room_id: host.member_id }
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.host-li{
    margin: 3px 6px 3px 0;
    width: 120px;
    padding: 8px 10px 7px;
    box-shadow: 0px 0px 4px 0px rgba(15,85,153,0.22);
    border-radius: 3px;
}

.list, .header{
    padding-left: 8px;
    padding-right: 7px;
}
.host-item {
    .avatar{
        width: 35px;
        height: 35px;
        background-color: #C9CFED;
        border-radius: 50%;
        .icon {
            background-image: url('../assets/images/common/live-icon.gif');
            background-position: right bottom;
            background-size: 11px 11px;
            background-repeat: no-repeat;
        }
    }
    .host-name{
        width: calc(100% - 40px);
    }

}
</style>
