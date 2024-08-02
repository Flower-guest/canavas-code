<template>
  <el-input
    class="mars-input"
    v-bind="attrs"
  >
    <!-- <template v-for="(comp, name) in slots" :key="name" v-slot:[name]>
      <component :is="comp" />
    </template> -->
  </el-input>
</template>
<script lang="ts">
import { useAttrs, useSlots, defineComponent } from "vue";
export default defineComponent({
  name: "mars-input",
  inheritAttrs: false,
  setup() {
    const attrs = useAttrs();
    const slots = useSlots();
    return {
      attrs,
      slots,
    };
  },
});
</script>
<style lang="less" scoped>
.mars-input {
  height: 32px;
  font-size: 12px !important;
  border: 1px solid;
  border-color: transparent;
  border-radius: 2px;
  :deep(.el-input) {
    background-color: transparent !important;
    font-size: 14px;
  }
}
</style>
