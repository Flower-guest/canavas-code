<template>
  <el-slider class="mars-slider" v-bind="attrs">
    <!-- <template v-for="(comp, name) in slots" :key="name" #[name]>
      <component :is="comp" />
    </template> -->
  </el-slider>
</template>
<script lang="ts">
import { useAttrs, useSlots, defineComponent } from "vue"
export default defineComponent({
  name: "mars-slider",
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
/*滑动条 输入面板内时修改高度等*/
.mars-slider {
  width: 100%;
  :deep(.el-slider__marks-text) {
    color: #fff !important;
    top: 5px;
  }
  /*滑动条 未选择、已选择部分 高度*/
  :deep(.el-slider__runway) {
    height: 10px;
    border-radius: 5px;
    background-color: #284660 !important;
  }
  /*滑动条 刻度点*/
  :deep(.el-slider__stop) {
    background-color: #16212c7d;
    top: 12px;
    height: 6px;
    width: 1px;
    border-radius: 0 0;
    border: none;
    background-color: #fff;
  }
  :deep(.el-slider__stop:first-child) {
    margin-left: 2px;
  }


}
</style>
