/*
  获取静态图片
*/
export function getAssets(url: string) {
  return new URL(`../assets/img/${url}`, import.meta.url).href;
}

// 获取服务器图片
export const getServeImg = (url) => {
  return url ? import.meta.env.VITE_BASE_URL + url : "";
};

export const timestampToYearMonthDay = (timestamp) => {
  // 创建一个新的Date对象，传入时间戳（注意时间戳是毫秒，而JavaScript的Date需要毫秒）
  const date = new Date(timestamp);

  // 获取年、月、日
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // 月份是从0开始的，所以需要+1
  const day = date.getDate().toString().padStart(2, '0');

  // 返回格式化的日期字符串
  return `${year}-${month}-${day}`;
}

export function transformData(data) {
  return Object.keys(data).map(key => {
      return {
          value: key,
          label: data[key]
      };
  });
}
