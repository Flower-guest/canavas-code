<template>
  <div class="text-[#fff]" v-if="viewStyles">
    <div class="text-[20px] mt-10px mb-10px">数据信息</div>
    <table
      class="mars-primary-table"
      border="1"
      bordercolor="#ffffff"
      cellspacing="0"
      cellpadding="0"
      v-if="styleValue"
    >
      <template
        v-for="item in materialConfig.dataAssociation"
        :key="item.label"
      >
        <tr>
          <td>{{ item.label }}</td>
          <td>
            <BaseComp
              :type="item.type"
              size="small"
              v-model="styleValue[item.name]"
              :dataType="styleValue['dataType']"
              :min="item.min || item.min === 0 ? item.min : -Infinity"
              :max="item.max || item.max === 0 ? item.max : Infinity"
              :step="item.step || 0.1"
              :options="item.data || []"
              @change="unionChange(item, item.data)"
              :tofixed="item.toFixed"
            />
          </td>
        </tr>
      </template>
    </table>
  </div>
  <div class="text-[#fff]" v-if="viewStyles">
    <div class="text-[20px] mt-10px mb-10px">样式信息</div>
    <table
      class="mars-primary-table"
      border="1"
      bordercolor="#ffffff"
      cellspacing="0"
      cellpadding="0"
      v-if="styleValue"
    >
      <template v-for="item in viewStyles.slice(6)" :key="item.label">
        <!-- 不是hidden类型 -->
        <template v-if="item.type !== 'hidden'">
          <tr>
            <td>{{ item.label }}</td>
            <td>
              <BaseComp
                :type="item.type"
                size="small"
                v-model="styleValue[item.name]"
                :min="item.min || item.min === 0 ? item.min : -Infinity"
                :max="item.max || item.max === 0 ? item.max : Infinity"
                :step="item.step || 0.1"
                :options="item.data || []"
                @change="unionChange(item, item.data)"
                :tofixed="item.toFixed"
              />
            </td>
          </tr>
          <!-- 材质相关属性 -->
          <template
            v-if="
              item.name === 'materialType' &&
              viewMaterials &&
              styleValue.materialOptions
            "
          >
            <tr v-for="(material, mi) in viewMaterials" :key="mi">
              <td>{{ material.label }}</td>
              <td>
                <BaseComp
                  :type="material.type"
                  size="small"
                  v-model="styleValue.materialOptions[material.name]"
                  :min="
                    material.min || material.min === 0
                      ? material.min
                      : -Infinity
                  "
                  :max="
                    material.max || material.max === 0 ? material.max : Infinity
                  "
                  :step="material.step || 0.1"
                  :options="material.data || []"
                  @change="materialChange(material)"
                />
              </td>
            </tr>
          </template>
        </template>
      </template>
    </table>
  </div>
  <div class="text-[#fff]" v-if="styleValue && styleValue.label">
    <div class="text-[20px] mt-10px mb-10px">注记信息</div>
    <table
      class="mars-primary-table"
      border="1"
      bordercolor="#ffffff"
      cellspacing="0"
      cellpadding="0"
    >
      <template v-for="item in viewLabels" :key="item.label">
        <tr>
          <td>{{ item.label }}</td>
          <td>
            <BaseComp
              :type="item.type"
              size="small"
              v-model="styleValue.label[item.name]"
              :min="item.min || item.min === 0 ? item.min : -Infinity"
              :max="item.max || item.max === 0 ? item.max : Infinity"
              :step="item.step || 0.1"
              :options="item.data || []"
              @change="labelChange(item)"
            />
          </td>
        </tr>
      </template>
    </table>
  </div>
</template>

<script lang="ts" setup>
import _ from "lodash-es";
import { ElMessage } from "element-plus";
import BaseComp from "./component/baseComp.vue";
import styleConfigAll from "./config/style.js";
import materialConfig from "./config/material.js";

const props = defineProps<{
  layerName: string;
  graphicType: string;
  customType?: string;
  style: any;
}>();

const emit = defineEmits(["styleChange"]);
const styleValue = ref<any>({});
const viewStyles = ref<any[]>([]);
const viewMaterials = ref<any[]>([]);
const styleType = ref("");

let originStyles: any = []; // 原始的完整style配置
const globalKey = ref(0);

watch(
  props,
  () => {
    if (props && props.style) {
      globalKey.value++;
      setDefault(); // 处理初始化默认值（不做任何修改之前的状态）
      updateViewStyles(); // 处理属性控件的显示隐藏

      if (styleValue.value.label) {
        setLabelDefault();
        updateViewLabels();
      }
    }
  },
  {
    immediate: true,
  }
);

// 非材质属性改变
function unionChange(item: any, selectOptions?: any[]) {
  const name = item.name;
  if (name === "fill" || name === "outline") {
    if (styleValue.value.fill === false && styleValue.value.outline === false) {
      ElMessage.error("填充和边框不能同时为否");
      nextTick(() => {
        styleValue.value[name] = true;
      });
      return;
    }
  }

  // 材质类型 materialType 改变时的特殊处理
  if (name === "materialType") {
    // 设置材质属性的默认值
    let defval = {};
    if (selectOptions) {
      const mOp = selectOptions.find(
        (item) => item.value === styleValue.value.materialType
      ); // 当前选项的材质属性配置
      if (mOp) {
        defval = mOp.defval || {};
      }
    }
    const materialType = styleValue.value.materialType.split("-")[0];
    const materialOptions = {};
    materialConfig[materialType].forEach((p) => {
      // 更新时的默认值的取值顺序 1. style.js 材质默认值 2. material.js 的默认值
      materialOptions[p.name] =
        defval[p.name] ?? getViewDefval(p, materialOptions);
    });
    styleValue.value.materialOptions = materialOptions;
  }

  // 处理属性控件的显示隐藏
  updateViewStyles();

  // 控制图层样式改变
  updateStyle(item);
}

// 更新属性的显示隐藏，通过配置中的show属性来控制
function updateViewStyles() {
  viewStyles.value = originStyles.filter((item: any) => {
    const isShow = getViewShow(item, styleValue.value);

    if (item.name === "materialType" && isShow) {
      // 处理材质相关属性的现实隐藏
      updateMaterialViewStyles();
    }
    return isShow;
  });
}

// 处理材质相关属性的现实隐藏，通过配置中的show属性来控制
function updateMaterialViewStyles() {
  const materialType = styleValue.value.materialType.split("-")[0];
  const defaultTypes = materialConfig[materialType] || [];

  viewMaterials.value = defaultTypes.filter((item) => {
    return getViewShow(item, styleValue.value.materialOptions);
  });
}

function getViewShow(config, styleOptions) {
  if (typeof config.show === "function") {
    return config.show(styleOptions, styleValue.value, props.graphicType);
  }
  return true;
}

function getViewDefval(config, styleOptions) {
  if (typeof config.defval === "function") {
    return config.defval(styleOptions, styleValue.value, props.graphicType);
  } else {
    return config.defval;
  }
}

// 设置初始化的默认值
function setDefault() {
  styleValue.value = _.cloneDeep(props.style);

  const styleConfig =
    styleConfigAll[props.customType] || styleConfigAll[props.graphicType];
  if (!styleConfig) {
    return;
  }

  styleType.value = styleConfig.type;
  originStyles = _.cloneDeep(styleConfig.style);
  originStyles = materialConfig.dataAssociation.concat(originStyles);

  let materialTypeOption;

  const materialType = styleValue.value.materialType;

  originStyles.forEach((item: any) => {
    styleValue.value[item.name] =
      styleValue.value[item.name] ?? getViewDefval(item, styleValue.value); // 数据中没有的地方使用默认值
    if (item.name === "materialType") {
      materialTypeOption = item;
    }
  });

  if (materialType && materialTypeOption) {
    if (!styleValue.value.materialOptions) {
      styleValue.value.materialOptions = {};
    }

    materialTypeOption.data.forEach((m) => {
      const value = m.value;
      if (value === materialType) {
        const defval = m.defval || {};
        materialConfig[materialType].forEach((p) => {
          const val = styleValue.value.materialOptions[p.name];
          // 初始化进入默认值的取值顺序 1. 本身属性 2. style中的属性 3. style.js 材质默认值 4. material.js 的默认值
          styleValue.value.materialOptions[p.name] =
            val ??
            styleValue.value[p.name] ??
            defval[p.name] ??
            getViewDefval(p, styleValue.value.materialOptions);
        });
      }
    });
  }
}

function updateStyle(item: any) {
  const val = styleValue.value[item.name];
  const data: Record<string, any> = {
    [item.name]: item.name === "materialType" ? val.split("-")[0] : val,
  };

  // 材质类型 materialType 改变时的特殊处理
  if (item.name === "materialType") {
    data.materialOptions = toRaw(styleValue.value.materialOptions);
  }
  if (item.name === "dataType") {
    styleValue.value["dataValue"] = "";
  }

  const isValueInName = materialConfig.dataAssociation.some(
    (item) => item.name === item.name
  );

  if (isValueInName) {
    emit("styleChange", data, "attr");
  } else {
    emit("styleChange", data);
  }
}

function updateMaterials() {
  const materialOptions: Record<string, any> = {};

  viewMaterials.value.forEach((item) => {
    materialOptions[item.name] =
      styleValue.value.materialOptions[item.name] ??
      getViewDefval(item, styleValue.value.materialOptions);
  });

  emit("styleChange", {
    materialOptions: materialOptions,
  });
}

function materialChange(item) {
  console.log("更换了材质类型", item);
  updateMaterialViewStyles();

  updateMaterials();
}

// label相关处理
let originLabels;
const viewLabels = ref<any[]>([]);

function setLabelDefault() {
  originLabels = _.cloneDeep(styleConfigAll.label.style);
  if (originLabels) {
    originLabels.forEach((item: any) => {
      styleValue.value.label[item.name] =
        styleValue.value.label[item.name] ??
        getViewDefval(item, styleValue.value.label); // 数据中没有的地方使用默认值
    });
  }
}
// 更新属性的显示隐藏，通过配置中的show属性来控制
function updateViewLabels() {
  viewLabels.value = originLabels.filter((item) => {
    return getViewShow(item, styleValue.value.label);
  });
}

function labelChange(item: any) {
  // 处理属性控件的显示隐藏
  updateViewLabels();

  // 控制图层样式改变
  updateLabel(item.name);
}

function updateLabel(name) {
  const label: Record<string, any> = {
    [name]: styleValue.value.label[name],
  };
  emit("styleChange", { label });
}
</script>

<style lang="less" scoped>
:deep(.el-collapse-item__header) {
  background-color: transparent !important;
  color: #fff;
}
:deep(.el-collapse-item__content) {
  background-color: transparent !important;
}
.attr-editor-label {
  word-break: break-all;
}
</style>
