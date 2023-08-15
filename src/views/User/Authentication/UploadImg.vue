<template>
    <div class="flex align-center flex-column" :key="updateKey">
        <van-uploader v-model="files" :max-count="1" :after-read="submit" @delete="deleteFile" :deletable="!isConfirmed">
            <span class="plus d-inline-block bg-center bg-no-repeat bg-size-100"></span>
        </van-uploader>
        <span v-if="label" class="font-12 m-t-10 font-500 text-white">{{  label  }}</span>
    </div>
</template>

<script>
import { Uploader, Toast } from 'vant'
import { uploadImage } from '../../../api/common/index'
import { statusCode } from '../../../utils/statusCode'
export default {
    name: 'UploadImg',
    components: {
        [Toast.name]: Toast,
        [Uploader.name]: Uploader
    },
    props: {
        label: {
            type: String,
            default: ''
        },
        url: {
            type: String,
            default: ''
        },
        maxSize: {
            type: Number,
            default: null
        },
        isConfirmed: { // 是否已实名
            type: Boolean,
            default: false
        }
    },
    data () {
        return {
            files: [],
            updateKey: +new Date().getTime()
        }
    },
    watch: {
        url: {
            handler (newVal, oldValu) {
                this.files = [
                    {
                        url: newVal
                    }
                ]
                this.updateKey = +new Date().getTime()
            }
        }
    },
    methods: {
        submit (file, detail) {
            console.log('asdf')
            if (this.maxSize) {
                // 需要校验最大值
                const fileSize = Math.ceil(file.file.size / 1024)
                if (fileSize > this.maxSize) {
                    Toast.fail(`头像大小不能超过${this.maxSize}kb!`)
                    this.updateKey = +new Date().getTime()
                    return
                }
            }
            // this.updateKey = +new Date().getTime()
            this.uploadImg(file.file)
        },
        async uploadImg (file) {
            const formData = new FormData()
            formData.append('file', file)
            formData.append('type', 'idcard')
            const { data, code, msg } = await uploadImage(formData)
            console.log(data, code, msg, '12')
            if (code === statusCode.success) {
                this.$emit('update:url', data.url)
                this.$emit('changeFile', data.url)
            }
        },
        deleteFile () {
            this.$emit('update:url', '')
            this.$emit('deleteFile', this.url)
        }
    }
}

</script>

<style lang="scss" scoped>
.plus {
    width: 100px;
    height: 70px;
    background-color: #6C73AF;
    background-image: url('../../../assets/images/my/apply/upload-bg.png');
    border-radius: 5px;
}

::v-deep {
    .van-uploader__preview, .van-uploader__preview-image, .van-uploader {
        width: 100px;
        height: 70px;
    }
    .van-uploader__preview {
        margin: 0;
    }
}
</style>
