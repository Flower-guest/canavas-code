import qs from "qs";
import jsonRequest from "..";

type MenuJsonData = {
  id: number,
  scene_camera: any,
  jsondata: any,
  menu_type: string,
  jsonurl: string,
  event_type: string,
  ismenu: number
}

export const getInfoById = (id) => {
  return jsonRequest.get({
    url: `gis/project/uieditgetInfoByid?gid=${id}`,
  });
};

// 获取激活菜单的json数据
export const getMenuJsonData = (id): Promise<MenuJsonData> => {
  return jsonRequest.get({
    url: `gis/project/getMenuJsonData?id=${id}`,
  });
};

// 保存对应激活菜单的数据
export const postMenuJsonData = (data) => {
  return jsonRequest.post({
    url: "gis/project/postMenuJsonData ",
    data: qs.stringify(data),
    headers: { "Content-Type": "application/x-www-form-urlencoded", }
  });
};

// 保存总json对应数据
export const postUIEdit = (data) => {
  return jsonRequest.post({
    url: "gis/project/uieditpost ",
    data: qs.stringify(data),
    headers: { "Content-Type": "application/x-www-form-urlencoded", }
  });
};

// 搜索对应数据
export const GetDatalistByType = (data) => {
  return jsonRequest.get({
    url: `gis/project/getDatalistByType?datatype=${data.datatype}&keyField=id&q_word[]=${data.word}&searchField[]=name`,
    showLoading: false,
  });
}

// 图片库
export const GetIconLibrarySelect = (data) => {
  return jsonRequest.get({
    url: `general/attachment/select?limit=${data.limit}&sort=id&order=desc&offset=${data.offset}&search=${data.search}&dialog=1`,
  });
}

// 图片上传
export const postUpload = (data) => {
  return jsonRequest.post({
    url: `ajax/upload`,
    data,
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });
}
