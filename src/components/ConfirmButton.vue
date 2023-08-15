<template>
<span class="d-inline-block text-center confirm-button">
    {{ title }}
</span>
</template>

<script>
export default {
    name: 'ConfirmButton',
    props: {
        title: {
            type: String,
            default: '确定'
        }
    }
}
</script>

<style lang="scss" scoped>
.confirm-button {
    border-radius: 3px;
    background-color: #FBA187;
}
</style>
