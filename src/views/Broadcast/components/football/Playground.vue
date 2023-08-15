<template>
    <div class="page bg-size-100 bg-center bg-no-repeat">
        <template>
            <template v-for="members in  home">
                <LineupMember
                    :key="member.id"
                    v-for="member in members"
                    is-home
                    :member="member"
                />
            </template>
        </template>
        <template>
            <template v-for="members in  away">
                <LineupMember
                    :key="member.id"
                    v-for="member in members"
                    :is-home="false"
                    :member="member"
                />
            </template>
        </template>
    </div>
</template>

<script>
import LineupMember from '../LineupMember.vue'
export default {
    name: 'PlayGround',
    components: {
        LineupMember
    },
    props: {
        home: {
            type: Object,
            default: () => ({})
        },
        away: {
            type: Object,
            default: () => ({})
        }
    }
}

</script>

<style lang="scss" scoped>
.page {
    background-image: url('../../../../assets/images/liveroom/playground-football.png');
    width: 345px;
    height: 800px;
}
</style>
