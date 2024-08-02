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
              style="width: 240px"
              clearable
            />
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
// import { GetIconLibrarySelect } from "@/service/api";
import { ElNotification } from "element-plus";
import { Check, Refresh, DeleteFilled } from "@element-plus/icons-vue";

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
  const data = {
    total: 15,
    rows: [
      {
        id: 31,
        mid: 2001,
        category: "unclassed",
        admin_id: 0,
        user_id: 0,
        url: "/uploads/20240731/908c9a82ab39a39110d3c904c24b273d.png",
        imagewidth: "36",
        imageheight: "36",
        imagetype: "png",
        imageframes: 0,
        filename: "组 9603.png",
        filesize: 1544,
        mimetype: "image/png",
        extparam: "",
        createtime: 1722408355,
        updatetime: 1722408355,
        uploadtime: 1722408355,
        storage: "local",
        sha1: "b429b2dd6202191cb15ae1d2185487034e3bd7e1",
        fullurl: "/uploads/20240731/908c9a82ab39a39110d3c904c24b273d.png",
        thumb_style: "",
      },
      {
        id: 30,
        mid: 2001,
        category: "unclassed",
        admin_id: 0,
        user_id: 0,
        url: "/uploads/20240731/943c663e4478d8e91e5a1129b3685b42.png",
        imagewidth: "36",
        imageheight: "36",
        imagetype: "png",
        imageframes: 0,
        filename: "组 9626.png",
        filesize: 1634,
        mimetype: "image/png",
        extparam: "",
        createtime: 1722408335,
        updatetime: 1722408335,
        uploadtime: 1722408335,
        storage: "local",
        sha1: "a91abd19559d802facf23ba5d613571824fdeffd",
        fullurl: "/uploads/20240731/943c663e4478d8e91e5a1129b3685b42.png",
        thumb_style: "",
      },
      {
        id: 29,
        mid: 2001,
        category: "unclassed",
        admin_id: 0,
        user_id: 0,
        url: "/uploads/20240731/01ff9d9398d6fb5ef90d86e7ba4c69fa.png",
        imagewidth: "36",
        imageheight: "36",
        imagetype: "png",
        imageframes: 0,
        filename: "组 9627.png",
        filesize: 1540,
        mimetype: "image/png",
        extparam: "",
        createtime: 1722408246,
        updatetime: 1722408246,
        uploadtime: 1722408246,
        storage: "local",
        sha1: "e19cca26871c47a1adaf2482eb757c95c784fb33",
        fullurl: "/uploads/20240731/01ff9d9398d6fb5ef90d86e7ba4c69fa.png",
        thumb_style: "",
      },
      {
        id: 28,
        mid: 2001,
        category: "unclassed",
        admin_id: 0,
        user_id: 0,
        url: "/uploads/20240731/06e5143b3428c07f0a289561bedd833c.png",
        imagewidth: "36",
        imageheight: "36",
        imagetype: "png",
        imageframes: 0,
        filename: "组 9610.png",
        filesize: 1312,
        mimetype: "image/png",
        extparam: "",
        createtime: 1722408139,
        updatetime: 1722408139,
        uploadtime: 1722408139,
        storage: "local",
        sha1: "fcaab94a439b70ae5a2b353df6b4f0d4239a5c79",
        fullurl: "/uploads/20240731/06e5143b3428c07f0a289561bedd833c.png",
        thumb_style: "",
      },
      {
        id: 27,
        mid: 2001,
        category: "unclassed",
        admin_id: 0,
        user_id: 0,
        url: "/uploads/20240731/454bb3afda5b7b50376afa30a1391a31.png",
        imagewidth: "36",
        imageheight: "36",
        imagetype: "png",
        imageframes: 0,
        filename: "组 9621.png",
        filesize: 1089,
        mimetype: "image/png",
        extparam: "",
        createtime: 1722408110,
        updatetime: 1722408110,
        uploadtime: 1722408110,
        storage: "local",
        sha1: "78bb9fe8dfd79b76565805d9504b93892de2950a",
        fullurl: "/uploads/20240731/454bb3afda5b7b50376afa30a1391a31.png",
        thumb_style: "",
      },
      {
        id: 26,
        mid: 2001,
        category: "unclassed",
        admin_id: 0,
        user_id: 0,
        url: "/uploads/20240731/3eefdaf086b0cecaed6622b09ea3182c.png",
        imagewidth: "36",
        imageheight: "36",
        imagetype: "png",
        imageframes: 0,
        filename: "组 9633.png",
        filesize: 1115,
        mimetype: "image/png",
        extparam: "",
        createtime: 1722407916,
        updatetime: 1722407916,
        uploadtime: 1722407916,
        storage: "local",
        sha1: "add5bb3ea34fe4bdb2eaae4715259f1a1b7d52a6",
        fullurl: "/uploads/20240731/3eefdaf086b0cecaed6622b09ea3182c.png",
        thumb_style: "",
      },
      {
        id: 25,
        mid: 2001,
        category: "unclassed",
        admin_id: 0,
        user_id: 0,
        url: "/uploads/20240731/6930caefd10b32dfac562dd7af2a6429.png",
        imagewidth: "27",
        imageheight: "28",
        imagetype: "png",
        imageframes: 0,
        filename: "组 8980.png",
        filesize: 1535,
        mimetype: "image/png",
        extparam: "",
        createtime: 1722407733,
        updatetime: 1722407733,
        uploadtime: 1722407733,
        storage: "local",
        sha1: "abea4d8c021550bdc3193f5a585166c8ef896f07",
        fullurl: "/uploads/20240731/6930caefd10b32dfac562dd7af2a6429.png",
        thumb_style: "",
      },
      {
        id: 24,
        mid: 2001,
        category: "unclassed",
        admin_id: 0,
        user_id: 0,
        url: "/uploads/20240731/61374b79a3003597b287bf971debb9b2.png",
        imagewidth: "24",
        imageheight: "21",
        imagetype: "png",
        imageframes: 0,
        filename: "组 8981.png",
        filesize: 1020,
        mimetype: "image/png",
        extparam: "",
        createtime: 1722407672,
        updatetime: 1722407672,
        uploadtime: 1722407672,
        storage: "local",
        sha1: "d3049bf528983536da41f12396c5a9060995b970",
        fullurl: "/uploads/20240731/61374b79a3003597b287bf971debb9b2.png",
        thumb_style: "",
      },
      {
        id: 23,
        mid: 2001,
        category: "unclassed",
        admin_id: 0,
        user_id: 0,
        url: "/uploads/20240731/e3ca6a590bcff23caf3650d82a1541e3.png",
        imagewidth: "36",
        imageheight: "36",
        imagetype: "png",
        imageframes: 0,
        filename: "组 9620.png",
        filesize: 1166,
        mimetype: "image/png",
        extparam: "",
        createtime: 1722407590,
        updatetime: 1722407590,
        uploadtime: 1722407590,
        storage: "local",
        sha1: "0726cdb2991d220320b0e6bd50d0929f8159d085",
        fullurl: "/uploads/20240731/e3ca6a590bcff23caf3650d82a1541e3.png",
        thumb_style: "",
      },
      {
        id: 22,
        mid: 2001,
        category: "unclassed",
        admin_id: 0,
        user_id: 0,
        url: "/uploads/20240731/61df7a1353263d2841f230e8f671a004.png",
        imagewidth: "24",
        imageheight: "27",
        imagetype: "png",
        imageframes: 0,
        filename: "组 8979.png",
        filesize: 1150,
        mimetype: "image/png",
        extparam: "",
        createtime: 1722407518,
        updatetime: 1722407518,
        uploadtime: 1722407518,
        storage: "local",
        sha1: "781a4d3a677f65f5cf09fd629d0fb3c85de24aa2",
        fullurl: "/uploads/20240731/61df7a1353263d2841f230e8f671a004.png",
        thumb_style: "",
      },
    ],
  };
  // const res = await GetIconLibrarySelect(iconState);
  iconState.list = data.rows;
  iconState.total = data.total;
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
  // getIconLibrarySelect()
};

// 分页按钮点击事件
const handleCurrentChange = (val: any) => {
  iconState.page = val;
  // getIconLibrarySelect()
};

// 刷新按钮点击事件
const handRefresh = () => {
  (iconState.list = []),
    (iconState.page = 1),
    (iconState.limit = 10),
    (iconState.total = 0),
    (iconState.offset = 0),
    (iconState.search = ""),
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
