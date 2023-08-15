<template>
    <div class="header p-relative text-center">
        <span
            class="p-absolute back-button h-100"
            @click="goBack"
        >
          <svg-icon icon-class="backward"></svg-icon>
        </span>
        <div class="font-medium font-500 font-16">{{ title }}</div>
    </div>
</template>

<script>
export default {
    name: 'HeaderWithBack',
    props: {
        title: {
            type: String,
            default: ''
        }
    },
    methods: {
        goBack () {
            this.$router.go(-1)
        }
    }
}
</script>

<style lang="scss" scoped>
.header {
    line-height: 46px;
    height: 46px;
    .back-button {
        width: 18px;
        left: 15px;
    }
}
::v-deep {
    .back-button {
        .svg-icon {
            width: 18px;
            height: 18px;
        }
    }
}
</style>
