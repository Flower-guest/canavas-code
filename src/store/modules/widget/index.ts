import { defineStore } from "pinia";

export const useWidGet = defineStore("widGet", {
  state: () => {
    return {
      currentWidget: "",
      activeMenuId: "", //左侧前端菜单激活的类型
      activeMenuName: ""
    };
  },
  getters: {},
  actions: {
    setCurrentWidget(currentWidget) {
      this.currentWidget = currentWidget;
    },
    setActiveMenuId(id) {
      this.activeMenuId = id
    },
    setActiveMenuName(name) {
      this.activeMenuName = name
    }
  },
});
