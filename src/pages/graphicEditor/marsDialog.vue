<template>
  <div
    class="mars-dialog-s"
    :class="[animationClass]"
    ref="dialogRef"
    v-show="visible"
  >
    <div class="flex justify-between items-center px-10px pt-4px">
      <span class="text-[14px]" style="color: rgba(234, 242, 255, 0.8)">{{
        props.title
      }}</span>
      <img
        class="w-14px cursor-pointer"
        :src="getAssets('gb3.png')"
        @click="updateVisible"
      />
    </div>
    <el-divider style="margin: 6px 0" />

    <el-scrollbar  max-height="700px" class="mars-dialog__content">
      <slot></slot>
    </el-scrollbar>
  </div>
</template>

<script lang="ts" setup>
import { getAssets } from "@/utils";
interface Props {
  title?: string; // 弹框标题
  visible?: boolean; // 是否显示
  animation?: string | boolean; // 是否开启开场动画，或开场动画的class名
  width?: number | string; // 初始宽度
  height?: number | string; // 初始高度
  left?: number; // 定位 left值
  right?: number; // 定位right值
  top?: number; // 定位top值
  bottom?: number; // 定位bottom值
  minWidth?: number; // 最小宽度
  minHeight?: number; // 最小高度
  maxWidth?: number; // 最大宽度
  maxHeight?: number; // 最大高度
  zIndex?: number; // 层级
}

const props = withDefaults(defineProps<Props>(), {
  visible: false,
  closeable: false,
  closeButton: true,
  animation: true,
  minWidth: 100,
  minHeight: 100,
  maxWidth: 100000,
  maxHeight: 1000,
  zIndex: 900,
});
const dialogRef = ref<any>();

const animationClass = computed(() => {
  if (props.animation === true) {
    const right = props.right;
    if (right && right >= 0 && right < 100) {
      return "fadein-right";
    }
    const left = props.left || 0;
    if (left || (left >= 0 && left < 100)) {
      return "fadein-left";
    }
    const top = props.top || 0;
    if (left || (top >= 0 && top < 100)) {
      return "fadein-down";
    }
    const bottom = props.bottom || 0;
    if (bottom || (bottom >= 0 && bottom < 100)) {
      return "fadein-up";
    }
    return "fadein-center";
  } else if (typeof props.animation === "string") {
    return props.animation;
  } else {
    return "";
  }
});

const emit = defineEmits(["update:visible"]);
const updateVisible = () => {
  emit("update:visible", false);
};
</script>

<style lang="less" scoped>
.mars-dialog-s {
  position: absolute;
  box-sizing: border-box;
  border-radius: 4px;
  z-index: 999 !important;
  background-color: rgba(39, 44, 54, 0.8);
  left: 220px;
  top: 40px;
  .mars-dialog__content {
    padding: 10px 10px 10px 10px;
    padding: 5px;
  }
}

/**下面是 5个 动画 */
@keyframes fadeInRight {
  from {
    opacity: 0;
    transform: translate3d(100%, 0, 0);
  }

  to {
    opacity: 1;
    transform: none;
  }
}
.fadein-right {
  -webkit-animation-duration: 1s;
  animation-duration: 1s;
  -webkit-animation-fill-mode: both;
  animation-fill-mode: both;
  -webkit-animation-name: fadeInRight;
  animation-name: fadeInRight;
}

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

@keyframes fadeInUp {
  from {
    opacity: 0;
    -webkit-transform: translate3d(0, 100%, 0);
    transform: translate3d(0, 100%, 0);
  }

  to {
    opacity: 1;
    -webkit-transform: none;
    transform: none;
  }
}

.fadein-up {
  -webkit-animation-duration: 1s;
  animation-duration: 1s;
  -webkit-animation-fill-mode: both;
  animation-fill-mode: both;
  -webkit-animation-name: fadeInUp;
  animation-name: fadeInUp;
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    -webkit-transform: translate3d(0, -100%, 0);
    transform: translate3d(0, -100%, 0);
  }

  to {
    opacity: 1;
    -webkit-transform: none;
    transform: none;
  }
}
.fadein-down {
  -webkit-animation-duration: 1s;
  animation-duration: 1s;
  -webkit-animation-fill-mode: both;
  animation-fill-mode: both;
  -webkit-animation-name: fadeInDown;
  animation-name: fadeInDown;
}

@keyframes fadeInCenter {
  from {
    opacity: 0;
    transform: scale(0.1);
  }

  to {
    opacity: 1;
    transform: none;
  }
}
.fadein-center {
  -webkit-animation-duration: 1s;
  animation-duration: 1s;
  -webkit-animation-fill-mode: both;
  animation-fill-mode: both;
  -webkit-animation-name: fadeInCenter;
  animation-name: fadeInCenter;
}
</style>
