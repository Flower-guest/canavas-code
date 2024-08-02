<template>
  <div class="w-100vw h-100vh overflow-hidden">
    <!-- cesium画布元素 -->
    <div id="cesiumContainer"></div>

    <AsyncTools v-model:visible="hasCameraEdit" v-model:showMenu="showMenu" />

    <!-- 视角设置 -->
    <AsyncCameraEdit v-model:visible="hasCameraEdit" />

    <!-- 左侧菜单json文件窗口 -->
    <AsyncWebMenu v-show="showMenu" />

    <!-- 左侧线、面、点编辑窗口 -->
    <AsyncGraphicEditor />

    <!-- 右侧线、面、点数据操作框 -->
    <AsyncGraphicLayerState v-model:visible="hasCameraEdit" />

    <!-- 底部经纬度信息 -->
    <div class="location">
      <div
        class="h-30px w-300px leading-30px bg-[#000] text-[#707070] text-16px px-34px"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import CesiumInit from "@/utils/cesium/CesiumInit";


// 异步子组件
const AsyncTools = defineAsyncComponent(() => import("./tools/index.vue"));
const AsyncWebMenu = defineAsyncComponent(() => import("./webMenu/index.vue"));
const AsyncCameraEdit = defineAsyncComponent(
  () => import("./cameraEdit/index.vue")
);
const AsyncGraphicEditor = defineAsyncComponent(
  () => import("./graphicEditor/index.vue")
);
const AsyncGraphicLayerState = defineAsyncComponent(
  () => import("./graphicLayerState/index.vue")
);

const hasCameraEdit = ref<boolean>(false);
const showMenu = ref<boolean>(true);

onMounted(() => {
  const cesium = (window.cesium = new CesiumInit());
  // 获取初始化值
  cesium.loadData();
});
</script>

<style lang="less" scoped>
#cesiumContainer {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden;
}
.location {
  width: 100%;
  position: absolute;
  bottom: 0;
  left: 0;
  color: #fff;
  background-color: rgba(0, 0, 0, 0.3);
  box-sizing: border-box;
  display: flex;
  align-items: center;
}
</style>
