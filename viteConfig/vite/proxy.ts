/*
 * @Author: cxj 1481240653@qq.com
 * @Date: 2023-09-13 16:35:39
 * @LastEditors: cxj 1481240653@qq.com
 * @LastEditTime: 2024-07-19 10:22:28
 * @FilePath: \country-3d-platform-mars3d\viteConfig\vite\proxy.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import {
  API_BASE_URL,
  API_TARGET_URL
} from "../constant";
import { ProxyOptions } from "vite";

type ProxyTargetList = Record<string, ProxyOptions>;

const init: ProxyTargetList = {
  [API_BASE_URL]: {
    target: API_TARGET_URL,
    changeOrigin: true,
    rewrite: (path) => path.replace(new RegExp(`^${API_BASE_URL}`), ""),
  },
};

export default init;
