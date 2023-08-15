<template>
<div class="box p-relative">
  <div class="inner dot-inner-animate p-absolute"></div>
  <div class="outer dot-outer-animate"></div>
</div>
</template>

<script>
export default {
    name: 'DynamicDot'
}
</script>

<style lang="scss" scoped>
.box {
  width: 20px;
  height: 20px;
}
.outer {
  width: 20px;
  height: 20px;
  background-color: #fdd0c3;
  border-radius: 20px;
}
.inner {
  width: 8px;
  height: 8px;
  left: 6px;
  top: 6px;
  border-radius: 8px;
  background-color: #fba187;
}
</style>
