<template>
    <van-dialog
        v-model="show"
        :show-confirm-button="false"
        className="download-dialog">
        <div class="box text-center">
            <img class="img" :src="img" />
            <div class="download-text text-center font-18 font-medium font-500 ">
                <span class="bg d-inline-block text-color bg-size-100 bg-center bg-no-repeat" @click="download">
                </span>
            </div>
            <div class="icon-box text-center m-t-10">
                <!-- <span class="icon-bg d-inline-block pointer" @click="closeDownloadDialog">
                    <van-icon name="cross"></van-icon>
                </span> -->
                <img :src="require('../assets/images/common/close1.png')" alt="" class="close" @click="closeDownloadDialog">
            </div>
        </div>
    </van-dialog>
</template>

<script>
import { Dialog, Icon } from 'vant'
import { mapState } from 'vuex'
export default {
    name: 'DownloadDialog',
    components: {
        [Dialog.Component.name]: Dialog.Component,
        [Icon.name]: Icon
    },
    data () {
        return {
            img: require('../assets/images/common/download1.png'),
            show: false
        }
    },
    computed: {
        ...mapState('commonData', ['showDownloadDialog'])
    },
    watch: {
        showDownloadDialog: {
            handler () {
                this.show = this.showDownloadDialog
            }
        }
    },
    methods: {
        download () {
            // eslint-disable-next-line no-undef
            const url = this.isAnd ? this._appDownloadUlr : this._appDownloadUlrIOS
            window.open(url, '_blank')
        }
    }
}
</script>

<style lang="scss" scoped>
.box {
    .img {
        width: 310px;
        height: 315px;
    }
    .download-text{
        height: 40px;
        line-height: 40px;
        margin-top: -20px;
        .bg {
            width: 122px;
            height: 43px;
            background-image: url("../assets/images/common/download-border1.png");
        }
    }
    .icon-box{
        .icon-bg {
            width: 27px;
            height: 27px;
            line-height: 27px;
            background-color: #D8D8D8;
            border-radius: 50%;
            font-size: 14px;
        }
    }
}
.close{
    width: 30px;
    height: 30px;
}
.van-dialog{
        width: auto;
    }

</style>
