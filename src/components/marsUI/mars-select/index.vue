<template>
  <el-select
    class="mars-select"
    :popper-class="'mars-select-dropdown'"
    clearable
    v-bind="attrs"
  >
    <el-option
      v-for="item in attrs.options"
      :key="(item as any).value"
      :label="(item as any).label"
      :value="(item as any).value"
    />
    <!-- <template v-for="(comp, name) in slots" :key="name" #[name]>
      <component :is="comp" />
    </template> -->
  </el-select>
</template>
<script lang="ts">
import { useAttrs, useSlots, defineComponent } from "vue";
export default defineComponent({
  name: "mars-select",
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
.mars-select {
  color: #fff;
  background-color: transparent !important;
  background: none;
  :deep(.el-select) {
    border-color: #b9b9b9 !important;
    background: none;
    background-color: transparent !important;
    &:hover,
    &:focus {
      border-color: #4db3ff !important;
    }
  }

  :deep(.el-input__suffix) {
    color: #fff !important;
  }

  :deep(.el-slider) {
    width: 96%;
  }
}
</style>
<style lang="less"></style>
