<!--
 * @Author: cxj 1481240653@qq.com
 * @Date: 2024-08-02 11:19:31
 * @LastEditors: cxj 1481240653@qq.com
 * @LastEditTime: 2024-08-02 21:38:38
 * @FilePath: \new-code-canvas\src\components\marsUI\mars-upload\index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="flex items-center">
    <el-input class="mars-upload" v-bind="attrs">
      <!-- <template v-for="(comp, name) in slots" :key="name" v-slot:[name]>
      <component :is="comp" />
    </template> -->
    </el-input>

    <svg-icon
      @click="visible = true"
      style="font-size: 26px"
      iconName="icon-vbsbianji"
      alt="图片选择"
    />
  </div>
  <DialogIconLibrary v-model:visible="visible" @choseImg="choseImg" />
</template>
<script lang="ts">
import { useAttrs, useSlots, defineComponent } from "vue";
export default defineComponent({
  name: "mars-upload",
  inheritAttrs: false,
  setup(props, { emit }) {
    const attrs = useAttrs();
    const slots = useSlots();
    const visible = ref<boolean>(false);
    console.log(props);

    const choseImg = (img) => {
      emit("update:modelValue", img);
      emit('change', img);
    };
    return {
      attrs,
      slots,
      visible,
      choseImg,
    };
  },
});
</script>
<style lang="less" scoped>
.mars-upload {
  height: 32px;
  width: 90%;
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
