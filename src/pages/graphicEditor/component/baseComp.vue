<!--
 * @Author: cxj 1481240653@qq.com
 * @Date: 2024-07-19 09:07:02
 * @LastEditors: cxj 1481240653@qq.com
 * @LastEditTime: 2024-08-02 11:21:42
 * @FilePath: \new-code-canvas\src\pages\graphicEditor\component\baseComp.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <span v-if="props.type === 'label'" class="attr-editor-label">{{
    attrs.value || ""
  }}</span>
  <component
    v-else
    :is="getComponent(props.type as keyof typeof components)"
    size="small"
    v-bind="attrs"
  />
</template>
<script setup lang="ts">
import { useAttrs } from "vue";
const props = withDefaults(
  defineProps<{
    type: string;
  }>(),
  {
    type: "label",
  }
);
const attrs = useAttrs();
const components = {
  input: "mars-input",
  number: "mars-input-number",
  radio: "mars-switch",
  slider: "mars-slider",
  color: "mars-color-picker",
  combobox: "mars-select",
  selectV2: "mars-select-v2",
  textarea: "mars-textarea",
  upload: "mars-upload",
  label: "span",
};
function getComponent(type: keyof typeof components) {
  return components[type];
}
</script>
