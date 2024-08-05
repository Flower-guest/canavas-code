<template>
  <teleport to="body">
    <div v-show="visible" class="dialog-icon-library">
      <div class="header">
        <span>选择</span>
        <svg-icon
          @click.stop="updateVisible"
          iconName="icon-vbsguanbi"
          alt="关闭"
        />
      </div>
      <div class="main">
        <div class="mb-6px flex justify-between items-center">
          <div class="search">
            文件名搜索：
            <el-input
              v-model="iconState.search"
              @change="getIconLibrarySelect"
              style="width: 240px"
              clearable
            />
            <el-button class="ml-6px" @click="getIconLibrarySelect" :icon="Search" circle />
          </div>
          <div class="flex">
            <el-button
              @click="handRefresh"
              :icon="Refresh"
              circle
              class="mr-8px"
            />
            <el-upload
              :accept="FileTypes.join(',')"
              :action="uploadUrl"
              :before-upload="beforeUpload"
              :on-success="uploadSuccess"
              :show-file-list="false"
              multiple
            >
              <el-button type="primary"
                ><el-icon class="el-icon--right"><Upload /></el-icon
                >上传</el-button
              >
            </el-upload>
          </div>
        </div>
        <div class="w-full">
          <el-table
            :data="iconState.list"
            :border="false"
            :empty-text="'暂无数据'"
            style="width: 100%"
            height="460px"
          >
            <el-table-column prop="id" label="id" />
            <el-table-column prop="url" label="预览">
              <template #default="scope">
                <img
                  :src="getServeImg(scope.row.url)"
                  width="36px"
                  height="36px"
                  alt="img"
                />
              </template>
            </el-table-column>
            <el-table-column prop="filename" label="文件名" />
            <el-table-column prop="createtime" label="创建日期">
              <template #default="scope">
                <span>{{ timestampToYearMonthDay(scope.row.createtime) }}</span>
              </template>
            </el-table-column>
            <el-table-column fixed="right" min-width="120" label="操作">
              <template #default="scope">
                <el-button
                  type="primary"
                  :icon="Check"
                  @click="operate(scope.row.url, 'img')"
                >
                  选择
                </el-button>
                <el-button
                  type="danger"
                  :icon="DeleteFilled"
                  @click="operate(scope.row.id, 'del')"
                >
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            class="pagination"
            v-model:current-page="iconState.page"
            v-model:page-size="iconState.limit"
            :page-sizes="[10, 15, 20]"
            :size="'default'"
            layout="total, sizes, prev, pager, next, jumper"
            :total="iconState.total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>
    </div>
  </teleport>
</template>

<script setup lang="ts">
import { getServeImg, timestampToYearMonthDay } from "@/utils";
import { GetIconLibrarySelect } from "@/service/api";
import { ElNotification } from "element-plus";
import { Check, Refresh, DeleteFilled, Search } from "@element-plus/icons-vue";

defineProps({
  visible: {
    type: Boolean,
  },
});
const message = useMessage();
const emit = defineEmits(["update:visible", "choseImg"]);

const uploadUrl = import.meta.env.VITE_BASE_URL + "ajax/upload",
  FileSize = 5,
  FileTypes = ["image/jpeg", "image/png", "image/jpg", "image/gif"];

const iconState = reactive<any>({
  list: [],
  page: 1,
  limit: 10,
  total: 0,
  offset: 0,
  search: "",
});

const getIconLibrarySelect = async () => {
  const res = await GetIconLibrarySelect(iconState);
  iconState.list = res.rows;
  iconState.total = res.total;
};

// 操作
const operate = (val, type) => {
  if (type === "img") {
    emit("choseImg", val);
    updateVisible();
  } else {
    console.log(val);
  }
};

const handleSizeChange = (val: number) => {
  iconState.limit = val;
  iconState.offset = (iconState.page - 1) * val;
  getIconLibrarySelect();
};

// 分页按钮点击事件
const handleCurrentChange = (val: any) => {
  iconState.page = val;
  iconState.offset = (iconState.page - 1) * iconState.limit;
  console.log(iconState.page, iconState.offset);
  getIconLibrarySelect();
};

// 刷新按钮点击事件
const handRefresh = () => {
  iconState.list = [];
  iconState.page = 1;
  iconState.limit = 10;
  iconState.total = 0;
  iconState.offset = 0;
  iconState.search = "";
  getIconLibrarySelect();
};

/**
 * @description 文件上传之前判断
 * @param rawFile 上传的文件
 * */
const beforeUpload = (rawFile) => {
  const imgSize = rawFile.size / 1024 / 1024 < FileSize;
  if (!FileTypes.includes(rawFile.type))
    ElNotification({
      title: "温馨提示",
      message: "上传图片不符合所需的格式！",
      type: "warning",
    });
  if (!imgSize)
    ElNotification({
      title: "温馨提示",
      message: `上传图片大小不能超过 ${FileSize}M！`,
      type: "warning",
    });
  return FileTypes.includes(rawFile.type) && imgSize;
};

const uploadSuccess = (res: any): void => {
  message.success("上传成功");
  console.log(res);
};

const updateVisible = () => {
  emit("update:visible", false);
};

getIconLibrarySelect();
</script>

<style lang="less" scoped>
.dialog-icon-library {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 800px;
  height: 600px;
  background-color: #fff;
  border-radius: 18px;
  z-index: 1000;
  overflow: hidden;

  .header {
    height: 36px;
    box-sizing: border-box;
    padding: 8px 16px;
    display: flex;
    justify-content: space-between;
    background-color: #4397fd;
    color: #fff;
  }
  .main {
    height: calc(100% - 36px);
    padding: 15px;
    .pagination {
      margin-top: 10px;
    }
  }
}
</style>
