<template>
  <div class="mars-dialog fadein-left" v-show="visible">
    <div class="flex justify-between items-center px-10px pt-4px">
      <span class="title">{{ store.activeMenuName }}</span>
      <img
        class="w-14px cursor-pointer"
        :src="getAssets('gb3.png')"
        @click="updateVisible"
      />
    </div>
    <el-divider style="margin: 6px 0" />
    <el-row :gutter="4">
      <template v-for="i in list" :key="i.name">
        <el-col class="text-right" :span="8">{{ i.name }}:</el-col>
        <el-col class="text-left" :span="16">
          <el-input
            v-if="isEdit"
            class="mars-input"
            @input="changeCamera"
            v-model="sceneCamera[i.prop]"
          />
          <span v-else>{{ sceneCamera[i.prop] }}</span>
        </el-col>
      </template>
      <el-col class="text-right" :span="8">飞行时间:</el-col>
      <el-col :span="16"><el-input v-model="sceneCamera.duration" /></el-col>
      <el-col class="mt-10px" :span="24">
        <el-button @click="isEdit = !isEdit" round>{{
          isEdit ? "取消编辑" : "编辑视角"
        }}</el-button>
        <el-button @click="setCamera(null)" round>当前视角</el-button>
        <el-button @click="save" round>保存</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts" setup>
import _ from "lodash-es";
import { getAssets } from "@/utils";
import { getMenuJsonData, postUIEdit, postMenuJsonData } from "@/service/api";
import { useMessage } from "@/hooks/useMessage";
import { useWidGet } from "@/store";

interface Props {
  visible: boolean; // 是否显示
}

defineProps<Props>();

const store = useWidGet();
const message = useMessage();
const list = [
  {
    name: "经度",
    prop: "lng",
  },
  {
    name: "纬度",
    prop: "lat",
  },
  {
    name: "方向",
    prop: "heading",
  },
  {
    name: "俯仰角",
    prop: "pitch",
  },
  {
    name: "视高",
    prop: "alt",
  },
];
const isEdit = ref<boolean>(false);
const sceneCamera = reactive({
  alt: "",
  pitch: "",
  heading: "",
  lng: "",
  lat: "",
  duration: 1,
});

// 监听左侧json面板变化
watch(
  () => store.activeMenuId,
  async (newVal) => {
    if (newVal && newVal !== window.info.id) {
      const { scene_camera } = await getMenuJsonData(newVal);
      setCamera(scene_camera);
    } else if (newVal === window.info.id) {
      setCamera(window.info.scene_camera);
    }
  }
);

const changeCamera = _.debounce(() => {
  window.cesium.flyToPoint(sceneCamera);
}, 500);

const setCamera = (scene_camera = null) => {
  const camera = scene_camera || window.cesium.map3d.getCameraView();
  const { alt, pitch, heading, lng, lat,duration } = camera;
  sceneCamera.alt = alt;
  sceneCamera.pitch = pitch;
  sceneCamera.heading = heading;
  sceneCamera.lng = lng;
  sceneCamera.lat = lat;
  sceneCamera.duration = duration;
  !scene_camera && changeCamera();
};

const save = async () => {
  try {
    const data = {
      id: store.activeMenuId,
      scene_camera: JSON.stringify(sceneCamera),
    };
    store.activeMenuId === window.info.id
      ? await postUIEdit(data)
      : await postMenuJsonData(data);
    message.success("保存成功！");
  } catch (error) {
    message.error("保存失败！");
  }
};

const emit = defineEmits(["update:visible"]);
const updateVisible = () => {
  emit("update:visible", false);
};
</script>

<style lang="less" scoped>
.mars-dialog {
  position: absolute;
  box-sizing: border-box;
  border-radius: 4px;
  background-color: rgba(39, 44, 54, 0.8);
  left: 220px;
  top: 40px;
  width: 210px;
  padding-bottom: 10px;

  .title {
    font-size: 14px;
    color: rgba(234, 242, 255, 0.8);
  }
}

::v-deep(.el-row) {
  width: 100%;
  color: #fff;
  margin-left: 0;
  .el-col-8 {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    height: 30px;
  }
  .el-col-16 {
    display: flex;
    align-items: center;
    height: 30px;
  }
  .el-input {
    height: 24px;
    .el-input__wrapper {
      background-color: transparent;
      .el-input__inner {
        color: #fff;
      }
    }
  }
  .el-button.is-round {
    padding: 8px 6px;
  }
}

/**下面是 5个 动画 */
@keyframes fadeInLeft {
  from {
    opacity: 0;
    transform: translate3d(-100%, 0, 0);
  }

  to {
    opacity: 1;
    transform: none;
  }
}
.fadein-left {
  -webkit-animation-duration: 1s;
  animation-duration: 1s;
  -webkit-animation-fill-mode: both;
  animation-fill-mode: both;
  -webkit-animation-name: fadeInLeft;
  animation-name: fadeInLeft;
}
</style>
