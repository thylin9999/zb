<template>
    <div>
      <div class="imgs flex align-center">
        <ul class="list flex">
          <li
          class="img-item p-relative flex align-center justify-center text-center m-r-10 bg-center bg-size-cover bg-no-repeat"
            v-for="(file,index) in files"
            :key="file"
            :style="{
                backgroundImage: `url(${file})`
            }"
          >
            <van-icon class="text-white p-absolute delete-icon" name="delete-o"  @click="deleteImg(index)"/>
          </li>
        </ul>
        <div v-if="files.length < 3" class="input-box p-relative pointer">
          <div class="p-absolute text-center plus-btn w-100 h-100">
            <van-icon name="plus" />
          </div>
          <input type="file"
              :key="updateKey"
              class="opacity-0 w-100 p-absolute h-100 d-inline-block"
              style="left: 0;top:0;"
              @change="submit"
        />
        </div>
      </div>
      <!-- <span class="tips font-14 font-400">说明：非必填，最多上传3张，上传您的线下实单或在其他平台推荐经历证明， 有助于提高您的过审几率</span> -->
    </div>
</template>

<script>
// import { Message } from 'element-ui'
import { Toast, Icon } from 'vant'
import { uploadImage } from '@/api/common'
import { statusCode } from '@/utils/statusCode'
export default {
    name: 'UploadMultiple',
    components: {
        [Toast.name]: Toast,
        [Icon.name]: Icon
    },
    props: {
        maxSize: {
            type: Number,
            default: 300
        }
    },
    data () {
        return {
            updateKey: +new Date().getTime(),
            files: []
        }
    },
    methods: {
        submit (e) {
            if (this.maxSize) {
            // 需要校验最大值
                const fileSize = Math.ceil(e.target.files[0].size / 1024)
                if (fileSize > this.maxSize) {
                    Toast.fail(`大小不能超过${this.maxSize}kb!`)
                    this.updateKey = +new Date().getTime()
                    return
                }
            }
            this.updateKey = +new Date().getTime()
            const file = e.target.files[0]
            this.uploadImg(file)
        },
        async uploadImg (file) {
            const formData = new FormData()
            formData.append('file', file)
            formData.append('type', 'idcard')
            const { data, code, msg } = await uploadImage(formData)
            console.log(data, code, msg, '12')
            if (code === statusCode.success) {
                this.files.push(data.url)
                this.changeFile()
            }
        },
        deleteImg (index) {
            this.files.splice(index, 1)
            this.changeFile()
        },
        changeFile () {
            this.$emit('update:fileList', this.files)
        }
    }
}

</script>

<style lang="scss" scoped>

.input-box, .img-item{
  width: 100px;
  height: 70px;
  line-height: 70px;
  color: #727272;
  border-radius: 5px;
  border: 1px dashed #6C73AF;
}
.plus-btn{
    font-size: 50px;
    line-height: 70px;
}
.opacity-0 {
    opacity: 0;
}
.delete-icon{
    right: 0;
    top: 0;
}
</style>
