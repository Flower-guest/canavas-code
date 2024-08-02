<template>
  <MarsDialog
    :title="graphicName + '属性编辑'"
    :top="10"
    :left="10"
    :minWidth="200"
    :visible="visible"
    @update:visible="update"
  >
    <div class="attr-editor-main">
      <MarsStyles
        :style="style"
        :layerName="layerName"
        :customType="customType"
        :graphicType="graphicType"
        @styleChange="styleChange"
      />
    </div>
  </MarsDialog>
</template>

<script setup lang="ts">
import * as mars3d from "mars3d";
import MarsDialog from "./marsDialog.vue";
import MarsStyles from "./marsStyle.vue";
import _ from "lodash-es";
import { useWidGet } from "@/store";
const store = useWidGet();
const layerName = ref("");
const customType = ref("");
const graphicType = ref("");
const graphicName = ref("");
const style = ref(null);
const visible = ref<any>(false);
let graphic;
watch(
  () => store.currentWidget,
  (newVal) => {
    visible.value = newVal ? true : false; //是否显示编辑框
    upDataLayer(newVal);
  }
);

// 监听到矢量数据发生变化
const upDataLayer = (newVal) => {
  if (!newVal) return;
  graphic = newVal;
  graphicName.value = getGraphicName(graphic);
  layerName.value = newVal._layer.name || "";
  graphicType.value = newVal.type;
  customType.value = newVal.options.styleType;
  // 添加注记信息
  if(!newVal.style?.label) newVal.style['label'] = { text: "" };
  style.value = _.cloneDeep(newVal.style);

  // 修改了矢量数据
  graphic.on([mars3d.EventType.editMovePoint], (event) => {
    visible.value = false;
    graphic.stopEditing();
    store.setCurrentWidget(event.graphic);
  });
};

const getGraphicName = (graphic) => {
  if (graphic.name) {
    return `${graphic.type} - ${graphic.name}`;
  }
  if (graphic.attr.index) {
    return `${graphic.type} - ${graphic.attr.index}`;
  }
  if (graphic.attr.remark) {
    return `${graphic.type} - ${graphic.attr.remark}`;
  }
  if (graphic?.style?.label?.text && graphic.style.label.text !== "0") {
    return `${graphic.type} - ${graphic.style.label.text}`;
  }

  return `${graphic.type} - ${graphic.name || "未命名"}`;
};

const update = (val) => {
  visible.value = val;
  graphic.stopEditing();
  store.setCurrentWidget("");
};

const styleChange = (style: any, prop = "") => {
  style = toRaw(style);
  graphic.setStyle(style);
  if (prop) graphic.attr = { ...graphic.attr, ...style };
};
</script>

<style lang="less" scoped>
.top-handle-bar {
  border-bottom: 1px solid #cde1de;
  padding: 5px 0 2px 0;
  :deep(.mars-icon) {
    cursor: pointer;
  }
}
.attr-editor-main {
  height: calc(100% - 40px);
  :deep(*) {
    font-size: 12px;
  }
}
.attr-editor-main::-webkit-scrollbar-button {
  height: 0;
  width: 0;
  display: none;
}

.attr-editor-main::-webkit-scrollbar-track {
  background: #173147;
}

.attr-editor-main::-webkit-scrollbar-track,
.attr-editor-main::-webkit-scrollbar-thumb {
  border: 0;
}

.attr-editor-main::-webkit-scrollbar {
  height: 10px;
  width: 12px;
  background: #c5c5c5;
  border-radius: 4px;
}

.attr-editor-main::-webkit-scrollbar-thumb {
  padding-top: 100px;
  background-color: #c5c5c5;
  height: 10px;
  border-radius: 4px;
  background-clip: padding-box;
}

::-webkit-scrollbar-track,
::-webkit-scrollbar-thumb {
  border: 0;
}
</style>
