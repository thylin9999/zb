<template>
<div class="link cs-link" v-if="link" @click="goLink">

</div>
</template>

<script>
import { getCsLink } from '@/api/common'
import { statusCode } from '@/utils/statusCode'

export default {
    name: 'CsLink',
    data () {
        return {
            link: ''
        }
    },
    created () {
        this.init()
    },
    methods: {
        async init () {
            const { code, data } = await getCsLink()
            if (code === statusCode.success) {
                this.link = data.link
            }
        },
        goLink () {
            window.open(this.link, '_blank')
        }
    }
}
</script>

<style scoped>
.link {
    width: 60px;
    height: 60px;
    background-image: url('../assets/images/common/cs-link.gif');
    background-position: center;
    background-size: 100%;
    background-repeat: no-repeat;
}
.cs-link {
    position: fixed;
    right: 10px;
    top: 60%;
    transform: translateY(-50%);
}
</style>
