<!--
 * @Author: cxj 1481240653@qq.com
 * @Date: 2024-07-19 09:07:01
 * @LastEditors: cxj 1481240653@qq.com
 * @LastEditTime: 2024-07-20 17:21:38
 * @FilePath: \new-code-canvas\src\components\marsUI\mars-input-number\index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <el-input-number
    class="mars-input-number"
    :controls="false"
    v-bind="attrs"
    :precision="attrs.tofixed"
  >
    <!-- <template v-for="(comp, name) in slots" :key="name" #[name]>
      <component :is="comp" />
    </template> -->
  </el-input-number>
</template>
<script lang="ts">
import { useAttrs, useSlots, defineComponent } from "vue";
export default defineComponent({
  name: "MarsInputNumber",
  inheritAttrs: false,
  setup() {
    const attrs = useAttrs();

    const slots = useSlots();
    console.log(attrs);
    // 在style.js中配置toFixed用于控制保留小数位数
    return {
      slots,
      attrs,
    };
  },
});
</script>
<style lang="less" scoped>
.mars-input-number {
  color: #ffffff;
  background-color: transparent !important;
  border-color: #b9b9b9;
  width: 100%;
  * {
    color: #ffffff;
  }
}
:deep(.el-input__wrapper) {
  background: none;
  .el-input__inner {
    color: #ffffff;
  }
}
</style>
