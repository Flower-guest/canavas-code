/*
 * @Author: cxj 1481240653@qq.com
 * @Date: 2023-09-13 16:35:39
 * @LastEditors: cxj 1481240653@qq.com
 * @LastEditTime: 2024-05-17 09:43:37
 * @FilePath: \country-3d-platform-mars3d\viteConfig\vite\plugins\unocss.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetUno,
} from "unocss";
// import transformerDirectives from "@unocss/transformer-directives";

export default defineConfig({
  // transformers: [transformerDirectives()],
  presets: [presetUno(), presetAttributify(), presetIcons()],
  shortcuts: [
    ["flex-center", "flex items-center"],
    ["flex-column-center", "flex flex-col justify-center items-center"],
    ["flex-justify", "flex items-center justify-center"],
    ["flex-between", "flex justify-between"],
    ["flex-between-center", "flex justify-between items-center"],
  ],
  rules: [],
});
