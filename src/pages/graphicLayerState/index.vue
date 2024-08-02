<!--
 * @Author: cxj 1481240653@qq.com
 * @Date: 2024-07-19 11:33:28
 * @LastEditors: cxj 1481240653@qq.com
 * @LastEditTime: 2024-08-02 11:26:45
 * @FilePath: \new-code-canvas\src\pages\graphicLayerState\index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div>
    <div class="mars-dialog" v-show="activeMenuId">
      <div class="mx-14px text-14px" style="color: rgba(234, 242, 255, 0.8)">
        {{ activeMenuName }}数据编辑
      </div>
      <el-divider style="margin: 6px 0" />
      <div class="f-mb mx-14px">
        <el-space>
          <span class="mars-pannel-item-label">数据维护:</span>
          <el-button
            :class="
              !formState.isDrawing ? 'data-maintain-three' : 'data-maintain'
            "
            v-if="!formState.isDrawing"
            @click="onClickStartDraw('polygonP')"
            >绘制面</el-button
          >
          <el-button
            :class="
              !formState.isDrawing ? 'data-maintain-three' : 'data-maintain'
            "
            v-if="!formState.isDrawing"
            @click="onClickStartDraw('polylineP')"
            >绘制线</el-button
          >
          <el-button
            :class="
              !formState.isDrawing ? 'data-maintain-three' : 'data-maintain'
            "
            v-if="!formState.isDrawing"
            @click="onClickStartDraw('pointP')"
            >绘制点</el-button
          >
          <el-button
            class="data-maintain"
            v-if="formState.isDrawing"
            @click="onClickClearDrawing"
            >取消绘制</el-button
          >
        </el-space>
      </div>

      <div class="data-edit mx-14px">
        <el-checkbox
          v-if="formState.enabledEdit"
          v-model="formState.hasEdit"
          @change="onChangeHasEdit"
          title="是否单击进行编辑状态"
          >是否编辑</el-checkbox
        >
        <el-checkbox
          v-model="formState.hasTable"
          title="显示图层内所有矢量数据列表"
          >显示列表</el-checkbox
        >
      </div>

      <div class="f-mb mx-14px">
        <el-space>
          <span class="mars-pannel-item-label">数据操作:</span>
          <el-upload
            :multiple="false"
            class="flex"
            name="file"
            accept=".json"
            :file-list="fileList"
            :show-upload-list="false"
            :before-upload="() => false"
            @change="onClickImpFile"
          >
            <el-button class="open-file-btn" title="打开JSON">导入</el-button>
          </el-upload>
          <el-button
            class="open-file-btn"
            @click="expJSONFile"
            title="导出Json"
          >
            导出
          </el-button>
          <el-button
            class="open-file-btn"
            @click="onClickClear"
            title="清除JSON"
            type="danger"
          >
            清除
          </el-button>
        </el-space>
        <el-space class="mt-14px">
          <span class="mars-pannel-item-label"></span>
          <el-button
            class="open-save-btn"
            @click="saveJSONFile"
            title="保存JSON"
          >
            保存数据
          </el-button>
          <el-button
            class="open-save-btn"
            @click="updateVisible()"
            title="视角编辑"
          >
            视角编辑
          </el-button>
        </el-space>
      </div>

      <div class="mx-14px text-14px" style="color: rgba(234, 242, 255, 0.8)">
        表单数据编辑
      </div>
      <el-divider style="margin: 6px 0" />
      <div class="f-mb data-list mx-14px">
        <AsyncTable
          :hasTable="formState.hasTable"
          :graphic-list="graphicDataList"
          @showEditor="showEditor"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useWidGet } from "@/store";
import * as mars3d from "mars3d";
import { useMessage } from "@/hooks/useMessage";
import { getMenuJsonData, postMenuJsonData, postUIEdit } from "@/service/api";
import { FormState, GraphicTableItem } from "./type";

const AsyncTable = defineAsyncComponent(() => import("./table.vue"));

const activeMenuName = ref<string>(""); // 当前选中的菜单名称

// 数据编辑属性面板 相关处理
const store = useWidGet();
const message = useMessage();

const formState = reactive<FormState>({
  enabledEdit: true,
  hasEdit: false,
  hasTable: true,
  isDrawing: false,
});

let drawUnit, activeMenuId;

// 监听左侧json面板变化
watch(
  () => store.activeMenuId,
  async (newVal, oldVal) => {
    activeMenuName.value = store.activeMenuName;
    if (oldVal) saveJSONFile(false); // 如果旧值存在，保存 JSON 文件
    // 立即更新 activeMenuId 并执行清空操作
    activeMenuId = newVal;
    onClickClear();

    if (activeMenuId && activeMenuId !== window.info.id) {
      const { jsondata, scene_camera } = await getMenuJsonData(activeMenuId);
      if (jsondata && Object.keys(jsondata).length !== 0)
        loadGeoJSON(jsondata, scene_camera);
    } else if (activeMenuId === window.info.id) {
      window.info.init_json &&
        loadGeoJSON(window.info.init_json, window.info.scene_camera);
    }
  }
);

onMounted(() => {
  drawUnit = window.cesium.drawUnit;

  setTimeout(() => {
    const layer = getManagerLayer();
    if (layer) {
      formState.hasEdit = layer.hasEdit; // 图层是否打开了编辑

      const graphics = layer.getGraphics();

      if (graphics.length > 0) {
        const lastgraphic = graphics[graphics.length - 1];
        formState.enabledEdit = lastgraphic.hasEdit;
      }

      layer.on(
        [
          mars3d.EventType.drawCreated,
          mars3d.EventType.addGraphic,
          mars3d.EventType.removeGraphic,
        ],
        () => {
          formState.isDrawing = layer.isDrawing;
        }
      );
    }
  }, 500);
});

// 获取map.js中定义的需要管理的图层
function getManagerLayer() {
  return drawUnit.drawLayer;
}

// 是否编辑
const onChangeHasEdit = () => {
  const layer = getManagerLayer();
  layer.hasEdit = formState.hasEdit;
};

// 绘制
const onClickStartDraw = (type) => {
  store.setCurrentWidget("");

  drawUnit.startDraw(type);
  const layer = getManagerLayer();
  formState.isDrawing = layer?.isDrawing;
};

const onClickClearDrawing = () => {
  const layer = getManagerLayer();
  layer.clearDrawing();
  formState.isDrawing = layer?.isDrawing;
};

//  清除数据
const onClickClear = () => {
  const layer = getManagerLayer();

  layer.enabledEvent = false; // 关闭事件，大数据removeGraphic时效率低
  layer.clear();

  layer.enabledEvent = true;

  formState.isDrawing = false;

  // 清除列表
  graphicDataList.value = [];

  store.setCurrentWidget("");
};
// 保存geojson
const saveJSONFile = async (show = true) => {
  const graphicLayer = getManagerLayer();
  if (!activeMenuId) {
    message.warning("当前没有选择菜单，无法保存！");
    return;
  }
  const jsondata = graphicLayer.toGeoJSON();
  const data = {
    jsondata: JSON.stringify(jsondata),
    id: activeMenuId,
  };
  try {
    activeMenuId === window.info.id
      ? await postUIEdit({ id: activeMenuId, init_json: data.jsondata })
      : await postMenuJsonData(data);
    show && message.success("保存成功！");
  } catch (error) {
    message.error("保存失败！");
  }
};

const emit = defineEmits(["update:visible"]);
const updateVisible = () => {
  emit("update:visible", true);
};

// 导出geojson
const expJSONFile = () => {
  const graphicLayer = getManagerLayer();

  if (graphicLayer.length === 0) {
    message.warning("当前没有标注任何数据，无需导出！");
    return;
  }
  const geojson = graphicLayer.toGeoJSON();
  mars3d.Util.downloadFile("矢量数据构造参数.json", JSON.stringify(geojson));
};

// 打开geojson
const onClickImpFile = (info: any) => {
  const item = info.raw;
  const fileName = item.name;
  const fileType = fileName
    ?.substring(fileName.lastIndexOf(".") + 1, fileName.length)
    .toLowerCase();

  if (fileType === "json" || fileType === "geojson") {
    const reader = new FileReader();
    reader.readAsText(item, "UTF-8");
    reader.onloadend = function () {
      const geojson = JSON.parse(this.result as string);
      loadGeoJSON(geojson);
    };
  } else {
    message.error("暂不支持 " + fileType + " 文件类型的数据！");
  }
};

const loadGeoJSON = (geojson, sceneCamera = null) => {
  const graphicLayer = getManagerLayer();
  if (geojson.type === "graphic" && geojson.data) {
    graphicLayer.addGraphic(geojson.data);
    sceneCamera ? window.cesium.flyToPoint(sceneCamera) : graphicLayer.flyTo();
  } else {
    sceneCamera && window.cesium.flyToPoint(sceneCamera);
    graphicLayer.loadGeoJSON(geojson, { flyTo: sceneCamera ? false : true });
  }

  initGraphicTableData(graphicLayer);
};

const fileList = ref([]);

onMounted(() => {
  const graphicLayer = getManagerLayer();

  // 矢量数据创建完成
  graphicLayer.on(mars3d.EventType.drawCreated, function (e) {
    if (formState.hasEdit) {
      showEditor(e.graphic);
    }
  });

  // 单击开始编辑
  graphicLayer.on(mars3d.EventType.editStart, (e: any) => {
    setTimeout(() => {
      // 属性面板打开时，点击其他的矢量数据，打开后会被下面的执行关闭
      showEditor(e.graphic);
    }, 150);
  });
  // 修改了矢量数据
  graphicLayer.on([
    mars3d.EventType.editMovePoint,
    mars3d.EventType.editStyle,
    mars3d.EventType.editRemovePoint,
  ]);
  // 停止编辑
  graphicLayer.on(
    [mars3d.EventType.editStop, mars3d.EventType.removeGraphic],
    function () {
      setTimeout(() => {
        if (!graphicLayer.isEditing) {
          store.setCurrentWidget("");
        }
      }, 100);
    }
  );
});

let lastUUid = "";
const showEditor = (graphic: any) => {
  if (graphic.isDestroy) {
    return;
  }

  if (!graphic._conventStyleJson) {
    graphic.style = graphic.toJSON().style; // 因为示例中的样式可能有复杂对象，需要转为单个json简单对象
    graphic._conventStyleJson = true; // 只处理一次
  }

  if (lastUUid !== graphic.id) {
    store.setCurrentWidget(markRaw(graphic));
    lastUUid = graphic.id;
  } else {
    lastUUid = "";
  }
};

const graphicDataList = ref<GraphicTableItem[]>([]);

onMounted(() => {
  const graphicLayer = getManagerLayer();
  initGraphicTableData(graphicLayer);

  graphicLayer.on(mars3d.EventType.drawCreated, function (event) {
    const graphic = event.graphic;
    if (graphic.isPrivate) {
      return;
    }

    graphicDataList.value.push({
      key: graphic.id,
      name: getGraphicName(graphic),
    });
  });

  graphicLayer.on(mars3d.EventType.removeGraphic, function (event) {
    const graphicId = event.graphic.id;
    const idx = graphicDataList.value.findIndex(
      (item) => item.key === graphicId
    );
    if (idx !== -1) {
      graphicDataList.value.splice(idx, 1);
    }
  });
});

const initGraphicTableData = (graphicLayer) => {
  const list = graphicLayer.graphics;
  for (let i = list.length - 1; i >= 0; i--) {
    const graphic = list[i];
    if (graphic.isPrivate) {
      continue;
    }

    graphicDataList.value.push({
      key: graphic.id,
      name: getGraphicName(graphic),
    });
  }
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
</script>

<style scoped lang="less">
.mars-dialog {
  position: absolute;
  box-sizing: border-box;
  z-index: 999 !important;
  max-height: 604px;
  width: 340px;
  top: 40px;
  right: 10px;
  box-shadow: none;
  border-radius: 4px;
  backdrop-filter: blur(10px);
  padding: 4px 0 14px;
  overflow: auto;
  border-radius: 4px;
  background-color: rgba(39, 44, 54, 0.9);
}
.mars-pannel-item-label {
  width: auto;
  display: block;
  text-align: right;
  min-width: 60px;
  color: rgba(234, 242, 255, 0.8);
}

// 数据维护按钮

.data-maintain {
  width: 228px !important;
}

.data-maintain-three {
  width: 76px;
}

.open-file-btn {
  width: 76px !important;
}

.open-save-btn {
  width: 118px !important;
}

.data-edit {
  display: flex;
  justify-content: space-between;
  margin-left: 68px;
  margin-bottom: 10px;
}

::v-deep(.el-checkbox__label) {
  color: #fff;
}
</style>
