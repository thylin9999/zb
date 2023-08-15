<template>
<div class="page h-100">
    <van-nav-bar
        title="个人资料"
        left-arrow
        @click-left="onClickLeft"
    />
    <div class="user-info-content m-t-10" >
        <div class="upload-img flex align-center flex-column justify-center">
            <van-uploader
                :key="updateKey"
                :max-size="100 * 1024"
                :before-read="beforeRead"
                :after-read="submit"
                @oversize="onOversize"
            >
                    <span class="avatar bg-center bg-no-repeat bg-size-cover border-50 d-inline-block "
                        :style="{
                    backgroundImage: `url(${showLogo})`
                }"
                    ></span>
            </van-uploader>
            <span class="font-12 font-500 text-primary m-t-10">点击更换头像</span>
        </div>
        <van-cell title="昵称" :key="nickname">
            <template #right-icon>
                <van-field
                    class="p-l-10 text-right nick-input p-r-0 text-primary"
                    v-model="form.nickname"
                    name="昵称"
                    placeholder="请输入昵称"
                />
            </template>
        </van-cell>
        <van-cell title="性别" :key="`gender-${gender}`">
            <template #right-icon>
                <span class="text-primary" @click="showPopup">{{ form.gender }}</span>
            </template>
        </van-cell>
        <van-cell title="个人简介" :key="`sign-${sign}`">
            <template #label>
                <van-field
                    class="p-l-10 w-100 text-primary sign p-b-10 font-400"
                    v-model="form.sign"
                    name="个人简介"
                    placeholder="请输入简介"
                    maxlength="15"
                />
            </template>
        </van-cell>
        <div class="label-cell p-l-15 p-r-15  flex justify-between align-center" :key="label">
            <span class="text-white font-500" style="font-size: 14px">标签</span>
            <div class="label-box flex align-center justify-center  p-relative">
                <div :class="{'click-bg': showLabelOptions}">
                    <span class="title text-center font-12 d-inline-block  bg-no-repeat bg-center"
                          :class="{
                                'is-host': showLabel === '11',
                                'is-expert': showLabel === '12',
                                'is-fan' : showLabel === '1'
                            }"
                          @click="showLabelOptions = !showLabelOptions"
                          style="font-size: 14px;"
                    ></span>
                    <icon-png :icon="showLabelOptions ? 'my/top' : 'my/down'" :width="10" :height="10" />
                </div>
                <ul v-if="labels" class="options flex flex-column justify-around" :class="{
                        'is-expand': showLabelOptions
                    }">
                    <li
                        :key="option.id"
                        v-for="option in labels"
                        class="item-icon  bg-no-repeat bg-center"
                        @click="selectLabel(option)"
                        :class="{
                                'is-host': option.label === '11',
                                'is-expert': option.label === '12',
                                'is-fan' : option.label === '1'
                            }"
                    ></li>
                </ul>
            </div>
            <div class="border-bottom height-half"></div>
        </div>
        <div class="w-100 text-center m-t-80">
            <ConfirmButton class="submit-btn font-14 p-t-10 p-b-10 font-medium font-400 text-color" @click.native="save" title="确认保存"/>
        </div>
    </div>
    <van-popup v-model="show" position="bottom" >
        <van-picker
            title="性别"
            show-toolbar
            :columns="columns"
            @confirm="onConfirm"
            @cancel="closePopup"
        />
    </van-popup>
</div>
</template>

<script>
import { NavBar, Cell, Uploader, Toast, Field, Picker, Popup } from 'vant'
import ConfirmButton from '@/components/ConfirmButton'
import { uploadImage } from '@/api/common'
import { editUserInfo } from '@/api/user'
import { mapState, mapActions, mapMutations } from 'vuex'
import { statusCode } from '@/utils/statusCode'
import IconPng from '@/components/IconPng'
export default {
    name: 'UpdateUserInfo',
    components: {
        [NavBar.name]: NavBar,
        [Cell.name]: Cell,
        [Uploader.name]: Uploader,
        [Toast.name]: Toast,
        [Field.name]: Field,
        [Picker.name]: Picker,
        [Popup.name]: Popup,
        ConfirmButton,
        IconPng
    },
    data () {
        return {
            url: '',
            updateKey: +new Date().getTime(),
            form: {
                nickname: '',
                gender: '保密',
                sign: null
            },
            show: false,
            columns: ['男', '女', '保密'],
            showLabel: '1',
            showLabelOptions: false
        }
    },
    computed: {
        ...mapState('user', ['token', 'avatar', 'nickname', 'sign', 'gender', 'label', 'labels']),
        showLogo () {
            return this.url ? this.url : (this.avatar || this.userEmptyImg)
        },
        genderIndex () {
            return this.columns.findIndex(x => x === this.form.gender)
        },
        userInfo () {
            return {
                avatar: this.avatar,
                nickname: this.nickname,
                sign: this.sign,
                gender: this.gender
            }
        }
        // labels () {
        //     return [
        //         {
        //             id: '11',
        //             icon: 'chat/host',
        //             label: '主播'
        //         },
        //         {
        //             id: '12',
        //             icon: 'chat/expert',
        //             label: '专家'
        //         }
        //     ]
        // }
    },
    watch: {
        userInfo: {
            handler () {
                const genderStr = this.columns[this.gender - 1]
                this.url = this.avatar
                this.form.nickname = this.nickname
                this.form.gender = genderStr || '保密'
                this.form.sign = this.sign
                this.showLabel = this.label || '1'
            },
            immediate: true,
            deep: true
        }
    },
    methods: {
        ...mapActions('user', ['getUserInfo']),
        ...mapMutations('user', ['SET']),
        onClickLeft () {
            this.$router.go(-1)
        },
        beforeRead (file) {
            console.log(file, file.type, 'file')
            // image/png gif
            if (!file.type.includes('image/')) {
                Toast('请上传 jpg 格式图片')
                return false
            }
            return true
        },
        updateCom () {
            this.updateKey = +new Date().getTime()
        },
        onOversize () {
            Toast('用户头像大小不能超过100kb')
        },
        async submit (file) {
            const formData = new FormData()
            formData.append('file', file.file)
            formData.append('type', 'avatar')
            try {
                const { data, code, msg } = await uploadImage(formData)
                if (code === statusCode.success) {
                    this.url = data.url
                    this.updateCom()
                    Toast(msg)
                }
            } catch (e) {
                console.log('错了')
            }
        },
        showPopup () {
            this.show = true
        },
        closePopup () {
            this.show = false
        },
        onConfirm (value, index) {
            this.closePopup()
            this.form.gender = value
        },
        async save () {
            try {
                const { data, code, msg } = await editUserInfo({
                    ...this.form,
                    gender: this.genderIndex + 1,
                    avatar: this.url,
                    label: this.showLabel
                })
                if (code === statusCode.success) {
                    this.getUserInfo()
                }
                Toast(msg)
                console.log(data, 'data')
            } catch (e) {
                console.log('出错了')
            }
        },
        selectLabel (option) {
            this.showLabel = option.label
            this.showLabelOptions = false
            this.SET({ label: option.label })
        }
    }
}
</script>

<style lang="scss" scoped>
.page {
    background-color: #0E0E23;
}
.upload-img{
    height: 200px;
    .avatar {
        width: 65px;
        height: 65px;
        vertical-align: middle;
    }
}
.user-info-content {
    height: calc(100vh - 110px);
    overflow-y: auto;
    background-color: #161C4F;

    .nick-input {
        width: 70%;
        padding-right: 0!important;
    }
    .sign{
        line-height: 17px;
    }
}
.submit-btn{
    width: 270px;
    height: 35px;
    border-radius: 17px;
}
.label-cell{
    line-height: 45px;
    height: 45px;
    position: relative;
}
.border-bottom{
    height: 1px;
    width: 702px;
    position: absolute;
    bottom: 0;
    left: -165px;
    right: 0;
    background: #2F3568;
    margin: 0 auto;
    transform: scale(.5);
}

.label-box {
    height: 100%;
    >div:nth-child(1){
        width: 71px;
        height: 23px;
        line-height: 23px;
        border-radius: 5px;
        display: flex;
        justify-content: space-around;
        align-items: center;
        &.click-bg{
            background: #6C73AF;
        }
    }
    .title {
        width: 46px;
        height: 19px;
        background-size: 100%;
        color: #ffffff;
        display: block;
        &.is-host {
            background-image: url('../../assets/images/my/host-tag.png');
        }
        &.is-expert {
            background-image: url('../../assets/images/my/expert-tag.png');
        }
        &.is-fan {
            background-image: url('../../assets/images/my/fan-tag.png');
        }
    }

    .options{
        position: absolute;
        right: 0;
        top: 33px;
        height: 0;
        width: 71px;
        background: #30366A;
        z-index: 1;
        .item-icon {
            display: inline-block;
            width: 46px;
            height: 19px;
            background-size: 100% 100%;
            margin: 0 auto;
            &.is-host {
                background-image: url('../../assets/images/my/host-tag.png');
            }
            &.is-expert {
                background-image: url('../../assets/images/my/expert-tag.png');
            }
            &.is-fan {
            background-image: url('../../assets/images/my/fan-tag.png');
        }
        }
        .item-icon:nth-child(1){
            margin-top: 5px;
        }
        &.is-expand {
            min-height: 65px;
        }
    }
}
.m-t-80{
    margin-top: 80px;
}
::v-deep {
    .van-cell {
        line-height: 45px;
        padding-bottom: 0;
        padding-top: 0;
        background-color: transparent;
    }
    .van-field__control {
        text-align: right;
    }
    .van-nav-bar__content{
        height: 46px;
    }
    .van-picker{
        background: #2B1845;
    }
    .van-picker-column__item--selected{
        width: 347px;
        height: 40px;
        background: #30366A;
        border-radius: 5px;
        color: #FFFFFF !important;
        margin: 0 auto;
    }
    .van-picker-column__item{
        color: #6C73AF;
    }
    .van-picker__mask{
        background: none;
    }
    .van-picker__title{
        color: #FFFFFF;
        font-size: 16px;
    }
    .van-picker__cancel, .van-picker__confirm{
        width: 57px;
        height: 26px;
        background: #30366A;
        border-radius: 4px;
        padding: 0;
        text-align: center;
        line-height: 26px;
        font-size: 12px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #FFFFFF;
    }
    .van-picker__confirm{
        background: #FBA187;
    }
    .van-picker__toolbar{
        border-bottom: 1px solid #2F3568;
        width: 90%;
        margin: 0 auto;
        height: 54px;
    }
}
</style>
