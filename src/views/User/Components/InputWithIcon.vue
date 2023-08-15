<template>
<div class="row p-relative flex align-center p-l-20">
    <div class="prefix-icon font-20">
        <slot name="icon"/>
    </div>
    <div class="flex-1">
        <slot/>
    </div>
   <div class="suffix-button" v-if="hasSuffix">
       <slot name="suffix"/>
   </div>
</div>
</template>

<script>
export default {
    name: 'InputWithIcon',
    props: {
        hasSuffix: {
            type: Boolean,
            default: false
        }
    }
}
</script>

<style lang="scss" scoped>
.row {
    background-color: rgba(0,0,0, .4);
    border-radius: 40px;
    .suffix-button{
        width: 90px;
    }
}
::v-deep {
    .svg-icon {
        width: 14px;
        max-height: 20px;
    }
}
</style>
