<template>
<div class="message-row flex font-regular">
<!--    <div class="icon bg-center  bg-no-repeat"></div>-->
    <div class="message-box flex-1 p-l-10 p-r-10" v-if="typeList.includes(msgCon.type)">
        <div class="message text-primary flex align-center" :style="{color: msgCon.type === '1040' ? '#ffffff' : ' #989cb3'}">
            <!-- <span class="font-14 user-name" v-if="!msgCon.member_id">
                <span class="touristLevel" > Lv 0</span> -->
<!--                <span class="memberLevel" v-else> Lv 1</span>-->
            <!-- </span> -->
            <span
                class="user-label bg-center bg-no-repeat bg-size-cover is-vip"
                :class="{
                    'is-host':isHost,
                    'is-expert': isExpert,
                    'is-visitor': isVisitor
                }"
            ></span>
            <div class="name-box m-l-5 d-inline-block"
                :class="{
                    'is-jump': !!msgCon.content && msgCon.content.jump_url
                }"
                 @click="showPopup(msgCon)"
            >
                <span class="name">{{msgCon.nickname + ':'}}</span>
                {{ msgCon.msg }}
            </div>
        </div>
    </div>
    <div class="message-box notice-box flex-1 p-l-10 p-r-10" v-if="['1120'].includes(msgCon.type)">
        <div class="message font-14 text-primary" style="color: #989cb3">
            <span class="font-14 notice">{{ '系统提示：' }}</span>
            {{ msgCon.msg }}</div>
    </div>
    <!-- 礼物 -->
    <div class="message-box notice-box flex-1 p-l-10 p-r-10" v-if="['1121'].includes(msgCon.type)">
        <div class="message font-14 text-primary white gift">
            <span class="user-label bg-center bg-no-repeat bg-size-cover is-vip m-r-5"
            :class="{
                'is-host':isHost,
                'is-expert': isExpert,
            }" />
            {{ msgCon.msg }}
            <img :src="msgCon.img" alt="" class="giftPng">
        </div>
    </div>
</div>
</template>

<script>
import { mapState } from 'vuex'

export default {
    name: 'MessageRow',
    props: {
        isMe: {
            type: Boolean,
            default: false
        },
        msgCon: {
            type: [Object, String],
            default: function () {
                return {}
            }
        },
        hideCome: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        ...mapState('user', ['token']),
        isChatMessage () {
            return this.typeList.includes(this.msgCon.type)
        },
        hasUserInfo () {
            return this.isChatMessage && !!this.msgCon.member_id
        },
        userInfo () {
            return this.hasUserInfo && this.msgCon.content?.userInfo
        },
        isExpert () {
            return this.userInfo && this.userInfo.label === '12'
        },
        isHost () {
            return this.userInfo && this.userInfo.label === '11'
        },
        isVisitor () {
            return this.msgCon && !this.msgCon.member_id
        }
        // isVip () { // 会员
        //     return this.userInfo && this.userInfo.label === '1'
        // }
    },
    data () {
        return {
            typeList: ['1010', '1040']
        }
    },
    methods: {
        showPopup (data) {
            if (!!data.content && data.content.jump_url) {
                this.$emit('showPopup', data)
            }
        }
    }
}
</script>

<style lang="scss" scoped>
  .message-row{
      padding: 5px 0;
  }
.icon {
    width: 40px;
    height: 40px;
    background-image: url('../../../assets/images/my/logo.png');
    background-size: 100% 100%;
}
.message-box {
    color: #989cb3;
    font-size: 13px;
    .message{
        color: #000;
    }
    .user-name {
        flex-shrink: 0;
        color: #1c73e9;
        line-height: 25px;
        font-weight: 600;
        .touristLevel,.memberLevel{
            font-size: 12px;
            border-radius: 3px;
            padding: 0 5px;
            color: #fff;
            background-color: #B7B7B7;
        }
        .memberLevel{
            background-color: #6CCEFF;
        }
    }
    .user-label {
        flex-shrink: 0;
        width:45px;
        height:20px;
        line-height: 25px;
        display: inline-block;
        &.is-vip {
            background-image: url('../../../assets/images/chat/vip.png');
        }

        &.is-expert {
            background-image: url('../../../assets/images/chat/expert.png');
        }
        &.is-host {
            background-image: url('../../../assets/images/chat/host.png');
        }
        &.is-visitor {
            background-image: url('../../../assets/images/chat/visitor.png');
        }

    }
    .name-box {
        line-height: 17px;
        .name {
            font-weight: 400;
            color: #fff;
        }
        &.is-jump {
            padding: 6px;
            background: #30366a;
            color: #fff;
            border-radius: 5px;
            border: 1px solid #79CBFF;
            box-shadow: 2px 2px 1px 1px #79CBFF;
        }
    }
  .notice{
      color: #1c73e9;
      line-height: 17px;
      font-weight: 600;
  }
    .message {
        line-height: 25px;
    }
}
.giftPng{
    width: 30px;
    height: 30px;
}
.white{
    color: #ffffff !important;
}
.gift{
    display: flex;
    align-items: center;
    font-size: 13px;
}

</style>
