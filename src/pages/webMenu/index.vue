<template>
  <el-scrollbar class="menu">
    <el-tree
      class="tree"
      @node-click="nodeChange"
      :data="menu"
      :default-expand-all="true"
      :props="props"
    />
  </el-scrollbar>
</template>

<script setup lang="ts">
import { useWidGet } from "@/store";

const { setActiveMenuId, setActiveMenuName } = useWidGet();

const menu = window.info.menu;

const props = {
  value: "id",
  label: "name",
  children: "childlist",
};

const nodeChange = (data) => {
  if (data.jsonurl || data.childlist.length > 0) {
    return;
  }
  setActiveMenuId(data.id);
  setActiveMenuName(data.name);
};
</script>

<style lang="less" scoped>
.menu {
  width: 200px;
  position: absolute;
  left: 0;
  top: 0;
  height: calc(100vh - 30px);
  background-color: rgba(39, 44, 54, 0.8);
  overflow: hidden;
  overflow-y: auto;
  border-right: 1px solid #3c3a3ad9;

  ::v-deep(.tree) {
    width: 100%;
    height: 100%;
    background-color: transparent;
    color: #fff;
    .el-tree-node__content:hover,
    .el-tree-node.is-current .el-tree-node__content {
      background-color: transparent;
    }

    .el-tree-node.is-current .el-tree-node__label {
      color: #409eff; /* 你可以选择任何你想要的颜色 */
    }

    .el-tree-node__label {
      font-size: 13px;
    }
  }
}
</style>
