<template>
  <div class="tools" :style="{ width: toolWidth }">
    <template v-for="i in list" :key="i.iconName">
      <svg-icon
        @click="handleEvent(i.eventType)"
        :className="i.className"
        :iconName="i.iconName"
        :alt="i.alt"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import { useWidGet } from "@/store";
import { postUIEdit } from "@/service/api";

const { setActiveMenuId, setActiveMenuName } = useWidGet();
const message = useMessage();

const props = defineProps({
  showMenu: {
    type: Boolean,
    default: true,
  },
});

const list = [
  {
    iconName: "icon-vbsshouqi",
    className: "",
    eventType: "menuCollapse",
    alt: "收起菜单",
  },
  {
    iconName: "icon-vbschushihuashuju",
    eventType: "initData",
    className: "ml-6px",
    alt: "设置初始地图数据",
  },
  {
    iconName: "icon-vbstijiao",
    eventType: "saveData",
    className: "ml-6px",
    alt: "提交数据",
  },
];

const toolWidth = computed(() => {
  return props.showMenu ? "calc(100vw - 200px)" : "100vw";
});

const emit = defineEmits(["update:showMenu", "update:visible"]);
const handleEvent = (e: any) => {
  switch (e) {
    case "menuCollapse":
      list[0].className = !props.showMenu ? "" : "rotate-180";
      list[0].alt = !props.showMenu ? "收起菜单" : "展开菜单";
      emit("update:showMenu", !props.showMenu);
      break;
    case "initData":
      setActiveMenuId(window.info.id);
      setActiveMenuName("设置初始地图数据");
      break;
    case "saveData":
      postUIEdit(window.info)
        .then(() => {
          message.success("提交成功");
        })
        .catch((e) => {
          console.log(e);
        });

      break;
    default:
      break;
  }
};
</script>

<style lang="less" scoped>
.tools {
  position: absolute;
  top: 0;
  right: 0;
  height: 26px;
  background-color: rgba(39, 44, 54, 0.8);
  display: flex;
  align-items: center;
  padding-left: 6px;
  box-sizing: border-box;
  border-bottom: 1px solid #757373;
}
</style>
