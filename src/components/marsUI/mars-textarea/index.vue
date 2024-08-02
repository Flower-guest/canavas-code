<template>
  <el-input  type="textarea" class="mars-textarea" v-bind="attrs">
    <!-- <template v-for="(comp, name) in slots" :key="name" #[name]>
      <component :is="comp" />
    </template> -->
  </el-input>
</template>
<script lang="ts">
import { useAttrs, useSlots, defineComponent } from "vue"
export default defineComponent({
  name: "mars-textarea",
  inheritAttrs: false,
  setup() {
    const attrs = useAttrs()
    const slots = useSlots()
    return {
      attrs,
      slots
    }
  }
})
</script>
<style lang="less" scoped>
.mars-textarea {
  color: #ffffff;
  background-color: rgba(23, 49, 71, 0.8) !important;
  :deep(.el-textarea__inner) {
    background-color:rgba(23, 49, 71, 0.8) !important;
    color:  #ffffff;
  }
  :deep(.el-input__suffix .anticon) {
    color:  #ffffff;
  }
}
.mars-textarea[disabled]{
  color: #cdcdcd;
}
</style>
