<template>
  <el-table
    v-show="hasTable"
    :data="paginationTableData"
    :border="false"
    max-height="324"
    :show-header="false"
    :row-style="rowStyle"
    :empty-text="'暂无数据'"
    @row-click="graphicCustomRowObj"
    style="width: 100%"
  >
    <el-table-column prop="name" width="230" />
    <el-table-column align="right">
      <template #default="scope">
        <el-icon
          class="mr-10px"
          color="#f2f2f2"
          @click.stop="startEditGraphic(scope.row)"
        >
          <Edit />
        </el-icon>
        <el-icon color="#F96868" @click.stop="deleteGraphic(scope.row)">
          <Delete />
        </el-icon>
      </template>
    </el-table-column>
  </el-table>
  <el-pagination
    class="mt-12px"
    background
    layout="slot"
    v-show="hasTable && totalPage > 1"
    :total="totalPage"
    :page-size="pageSize"
    :current-page="currentPage"
    @current-change="changePage"
  >
    <div key="1" class="flex">
      <div class="pagination-btn" @click="changePage('prev')">上一页</div>
      <div class="pagination-btn mx-15px">
        <el-input v-model.number="currentPage" @input="jumpPage" />
        <span class="text-[#C8F1F9] mx-5px">/</span
        ><span class="text-[#C8F1F9]">{{ totalPage }}</span>
      </div>
      <div class="pagination-btn" @click="changePage('next')">下一页</div>
    </div>
  </el-pagination>
</template>

<script setup lang="ts">
import { GraphicTableItem } from "./type";
interface Props {
  hasTable: boolean; // 是否显示
  graphicList: GraphicTableItem[];
}

const props = defineProps<Props>();

const currentPage = ref<number>(1);
const pageSize = ref<number>(5); // 分页查询每页条数

// 列表样式
const rowStyle = () => {
  return {
    backgroundColor: "rgba(107, 224, 245, 0.5)",
    color: "#fff",
    cursor: "pointer",
  };
};

// 总页数
const totalPage = computed(() =>
  Math.ceil(props.graphicList.length / pageSize.value)
);

// 分页查询每页条数
const paginationTableData = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  // 返回分页后的数组
  return props.graphicList.slice(start, end);
});

// 获取map.js中定义的需要管理的图层
function getManagerLayer() {
  return window.cesium.drawUnit.drawLayer;
}

// 跳转页面事件
const jumpPage = (val: any) => {
  if (val <= 0) return (currentPage.value = 1);
  if (val > totalPage.value) return (currentPage.value = totalPage.value);
  currentPage.value = Number(val);
};

// 分页按钮点击事件
const changePage = (val: any) => {
  if (val == "prev") {
    if (currentPage.value < 2) return (currentPage.value = 1);
    currentPage.value--;
  } else if ("next") {
    if (currentPage.value > totalPage.value - 1) return;
    currentPage.value++;
  }
};

// 表格行: 点击含，飞行定位
const graphicCustomRowObj = (row: GraphicTableItem) => {
  const graphicLayer = getManagerLayer();
  const graphic = graphicLayer.getGraphicById(row.key);
  graphic.flyTo();
};
const emit = defineEmits(["showEditor"]);
// 表格行: 开始编辑graphic
function startEditGraphic(record: GraphicTableItem) {
  const graphicLayer = getManagerLayer();
  const graphic = graphicLayer.getGraphicById(record.key);
  // showEditor(graphic); // 修改style
  emit("showEditor", graphic);
}
// 表格行: 删除graphic
const deleteGraphic = (record: GraphicTableItem) => {
  const graphicLayer = getManagerLayer();
  const graphic = graphicLayer.getGraphicById(record.key);
  graphic && graphic.remove(true);
};
</script>

<style lang="less" scoped>
.el-table {
  --el-table-border-color: transparent;
  --el-table-border: none;
  --el-table-text-color: #bdbdbe;
  --el-table-header-text-color: #bdbdbe;
  --el-table-row-hover-bg-color: transparent;
  --el-table-current-row-bg-color: transparent;
  --el-table-header-bg-color: transparent;
  --el-table-bg-color: transparent;
  --el-table-tr-bg-color: transparent;
  --el-table-expanded-cell-bg-color: transparent;
}

::v-deep(table tr) {
  height: 24px;
  .cell {
    font-size: 14px;
  }
}

::v-deep(.el-table__body) {
  border-collapse: separate;
  border-spacing: 0 16px;
}

.pagination-btn {
  padding: 6px 18px;
  background: #143944;
  border: 1px solid #2195a8;
  color: #fff;
  cursor: pointer;
  ::v-deep(.el-input) {
    width: 50px;
    height: 20px;
    .el-input__wrapper {
      background-color: transparent;
      .el-input__inner {
        color: #fff;
      }
    }
  }
}
</style>
