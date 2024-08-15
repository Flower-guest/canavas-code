<template>
  <div class="tools" :style="{ width: toolWidth }">
    <template v-for="i in list" :key="i.iconName">
      <svg-icon
        @click="handleEvent(i.eventType)"
        @mouseenter="iconHoverColor(i, true)"
        @mouseleave="iconHoverColor(i, false)"
        :className="i.className"
        :iconName="i.iconName"
        :color="i?.color"
        :alt="i.alt"
      />
    </template>
  </div>
  <div class="xyz-dialog" v-show="dynamicForm.visible">
    <span class="title">添加影像服务地址：</span>
    <el-form class="mt-10px" :model="dynamicForm">
      <el-form-item
        class="xzy"
        v-for="(domain, index) in dynamicForm.domains"
        :key="index"
        label="影像地址:"
      >
        <el-input v-model="domain.value" />
        <el-button size="small" :icon="Plus" circle @click="addDomain(index)" />
        <el-button
          size="small"
          type="danger"
          :icon="Delete"
          circle
          @click="removeDomain(index)"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSubmit">保存</el-button>
        <el-button type="primary" @click="dynamicForm.visible = false"
          >关闭</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { useWidGet } from "@/store";
import { postUIEdit } from "@/service/api";
import { Plus, Delete } from "@element-plus/icons-vue";

const { setActiveMenuId, setActiveMenuName } = useWidGet();
const message = useMessage();

const props = defineProps({
  showMenu: {
    type: Boolean,
    default: true,
  },
  visible: {
    type: Boolean,
    default: true,
  },
});

const dynamicForm = reactive({
  visible: false,
  domains: [
    { value: "" }, // 初始化一个空的输入框
  ],
});

const list: any = reactive([
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
    iconName: "icon-vbsdituyingxiangtihuan",
    eventType: "saveXYZ",
    className: "ml-6px",
    alt: "添加影像图层",
  },
  {
    iconName: "icon-vbstijiao",
    eventType: "saveData",
    className: "ml-6px",
    alt: "提交数据",
  },
]);

const iconHoverColor = computed(() => (i, val) => {
  return val ? (i.color = "#FF7947") : (i.color = "#fff");
});
const toolWidth = computed(() => {
  return props.showMenu ? "calc(100vw - 200px)" : "100vw";
});

const emit = defineEmits(["update:showMenu", "update:visible"]);
const handleEvent = async (e: any) => {
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
    case "saveXYZ":
      dynamicForm.visible = !dynamicForm.visible;
      const orthoPhoto = window.info.orthophoto;
      if (orthoPhoto) {
        dynamicForm.domains = orthoPhoto
          .split(",")
          .map((item) => ({ value: item }));
      }
      break;
  }
};

const addDomain = (index) => {
  // 在指定位置添加一个新的输入框
  dynamicForm.domains.splice(index + 1, 0, { value: "" });
};

const removeDomain = (index) => {
  dynamicForm.domains.splice(index, 1); // 删除指定的输入框
};

const handleSubmit = async () => {
  const orthophoto = dynamicForm.domains.map((item) => item.value).join(",");
  console.log(orthophoto);
  try {
    const data = {
      id: window.info.id,
      orthophoto,
    };
    await postUIEdit(data);
    message.success("保存成功！");
  } catch (error) {
    message.error("保存失败！");
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

.xyz-dialog {
  position: absolute;
  box-sizing: border-box;
  border-radius: 4px;
  background-color: rgba(39, 44, 54, 0.8);
  left: 220px;
  top: 40px;
  width: 250px;
  padding: 10px;

  .title {
    font-size: 14px;
    color: rgba(234, 242, 255, 0.8);
  }

  :deep(.xzy) {
    .el-form-item__label {
      color: #fff;
    }

    .el-form-item__content {
      flex-wrap: nowrap;
      .el-button {
        margin-left: 2px;
      }
    }
  }
}
</style>
