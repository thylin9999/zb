<template>
    <div class="card p-10 flex align-center " @click="goToBroadcast">
        <img class="cover" :src="logo" alt="">
        <div class="right-info m-l-10 flex-1 flex flex-column">
            <div class="author w-100 flex align-center">
                <img class="icon" :src="competition.img ? competition.img : userEmptyImg" alt="">
                <span class="font-12 m-l-5 font-500 text-white">{{ competition.nick }}</span>
            </div>
            <div class="font-12 m-t-5 font-500 text-primary">{{ competition.room_title }}</div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'CompetitionCard',
    props: {
        competition: {
            type: Object,
            default: () => ({})
        }
    },
    computed: {
        logo () {
            return this.competition.live_cover
        },
        roomId () {
            return this.competition.room_id || this.competition.member_id
        }
    },
    methods: {
        goToBroadcast () {
            const { href } = this.$router.resolve({
                name: 'Broadcast',
                params: { id: this.competition.id },
                query: { room_id: this.roomId },
                append: true
            })
            window.open(href, '_blank')
        }
    }
}

</script>

<style lang="scss" scoped>
.card {
    width: 345px;
    height: 90px;
    background-color: #161C4F;
    .cover {
        width: 120px;
        height: 65px;
        border-radius: 5px;
    }
    .icon {
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background-color: #D8D8D8;
    }
    .right-info{
        line-height: 17px;
    }
}
</style>
