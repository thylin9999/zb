<template>
    <div class="bg-gray h-100">
        <van-nav-bar
            title="意见反馈"
            left-arrow
            @click-left="onClickLeft"
        />
        <div class="feedback bg-gray p-t-10 font-14 p-relative">
            <van-field
                v-model="message"
                autosize
                type="textarea"
                maxlength="200"
                :placeholder="placeholder"
            />
            <div class="p-absolute w-100 upload-footer">
                <van-uploader v-model="fileList" :max-count="1" :after-read="afterRead" />
                <span class="font-regular p-absolute word-limit font-14 text-black-3">最多只能输入200字</span>
            </div>
        </div>
    </div>
</template>

<script>
import { NavBar, Field, Uploader } from 'vant'
export default {
    name: 'Feedback',
    components: {
        [NavBar.name]: NavBar,
        [Field.name]: Field,
        [Uploader.name]: Uploader
    },
    data () {
        return {
            fileList: [],
            message: '',
            placeholder: '请将您遇到的问题/产品建议反馈给我们，建议您尽可能详细的描述问题，便于运营同学帮您解决。'
        }
    },
    created () {
    },
    methods: {
        onClickLeft () {
            this.$router.go(-1)
        },
        afterRead (file) {
            file.status = 'uploading'
            file.message = '上传中...'

            setTimeout(() => {
                file.status = 'failed'
                file.message = '上传失败'
            }, 1000)
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/theme/default-vars.scss';
.feedback {
    height: calc(100% - 46px);
    overflow-y: overlay;
    .upload-footer {
        left: 10px;
        top: 180px;
        height: 110px;
        .word-limit {
            right: 25px;
            bottom: 10px;
        }
    }
}
::v-deep {
    .feedback .van-field__control {
        display: inline-block;
        font-size: 14px;
        color: #A7A7A7!important;
        height: 150px!important;
        overflow-y: overlay;
    }
    .van-field__body {
        height: 150px;
        align-items: flex-start!important;
    }
    .van-field {
        height: 280px;
    }
    .van-uploader__upload {
        margin: 0;
        width: 100px;
        height: 100px;
    }
    .van-uploader__mask, .van-uploader__preview-image {
        width: 100px;
        height: 100px;
    }
}
</style>
