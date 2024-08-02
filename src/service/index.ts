/*
 * @Author: cxj 1481240653@qq.com
 * @Date: 2024-07-19 09:07:02
 * @LastEditors: cxj 1481240653@qq.com
 * @LastEditTime: 2024-07-25 14:32:49
 * @FilePath: \new-code-canvas\src\service\index.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import Request from "./request";

const timeOut = 30000;
export const jsonRequest = new Request({
  baseURL: import.meta.env.VITE_BASE_URL + "",
  timeout: timeOut,
  headers: { 'Content-Type': 'application/json' },
  interceptors: {
    requestInterceptor: (config) => {
      return config;
    },
  },
});

export default jsonRequest;
