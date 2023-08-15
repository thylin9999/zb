<template>
    <div  class="w-100 flex font-12 font-400 text-white align-center justify-between">
        <div class="team-home flex align-center">
            <img :src="home.icon" alt="">
            <span>{{  home.name }}</span>
        </div>
        <div class="team-away  flex align-center">
            <span>{{  away.name }}</span>
            <img :src="away.icon" alt="">
        </div>
    </div>
</template>

<script>
export default {
    name: 'TeamWithIcon',
    props: {
        matchInfo: {
            type: Object,
            default: () => ({})
        }
    },
    computed: {
        home () {
            return {
                name: this.matchInfo.homeChs,
                icon: this.matchInfo.homeLogo
            }
        },
        away () {
            return {
                name: this.matchInfo.awayChs,
                icon: this.matchInfo.awayLogo
            }
        }
    }
}

</script>

<style lang="scss" scoped>
img {
    width: 20px;
    height: 20px;
    border-radius: 50%;
}
.team-home {
    img {
        margin-right: 3px;
    }
}
.team-away {
    img {
        margin-left: 3px;
    }
}
</style>
