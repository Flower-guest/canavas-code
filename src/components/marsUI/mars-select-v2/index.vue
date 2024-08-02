<template>
  <el-select
    v-bind="attrs"
    class="mars-select"
    :popper-class="'mars-select-dropdown'"
    filterable
    remote
    :remote-method="getDatalistByType"
  >
    <el-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value"
    />
  </el-select>
</template>
<script lang="ts">
import _ from "lodash-es";
import { GetDatalistByType } from "@/service/api";
export default defineComponent({
  name: "mars-select-v2",
  inheritAttrs: false,
  setup() {
    const attrs: any = useAttrs();
    const slots = useSlots();
    const options = ref<any[]>([]);

    const getDatalistByType = _.debounce(async (query = "") => {
      const datatype = attrs.dataType;
      if (!datatype) return;
      try {
        const res: any = await GetDatalistByType({ datatype, word: query });
        options.value = res.map((e) => ({ value: e.id, label: e.name }));
      } catch (e) {
        console.log(e);
      }
    }, 500);

    watch(
      () => attrs.dataType,
      () => {
        getDatalistByType("");
      }
    );

    return {
      attrs,
      slots,
      options,
      getDatalistByType,
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
