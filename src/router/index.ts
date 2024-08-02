/*
 * @Author: cxj 1481240653@qq.com
 * @Date: 2024-07-19 09:07:02
 * @LastEditors: cxj 1481240653@qq.com
 * @LastEditTime: 2024-07-22 18:44:30
 * @FilePath: \new-code-canvas\src\router\index.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    component: () => import("@/pages/index.vue"),
    meta: {
      type: "index",
      title: "首页",
    },
    children: [],
  }
];

const router = createRouter({
  routes,
  history: createWebHashHistory(),
});

export default router;
