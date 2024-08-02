/*
 * @Author: cxj 1481240653@qq.com
 * @Date: 2023-07-21 10:32:40
 * @LastEditors: cxj 1481240653@qq.com
 * @LastEditTime: 2024-07-19 18:50:53
 * @FilePath: \lhs-demo\src\utils\cesium\measure\index.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import * as mars3d from "mars3d";
import { useWidGet } from "@/store";

const store = useWidGet();

export default class DrawUnit {
  viewer: any;
  drawLayer: any;
  constructor(viewer) {
    this.viewer = viewer;
    this.init();
  }

  init() {
    this.drawLayer = new mars3d.layer.GraphicLayer();
    this.viewer.addLayer(this.drawLayer);
    this.bindLayerContextMenu();
  }

  startDraw(type) {
    if (type == "polylineP") {
      this.startDrawLine();
    } else if (type == "polygonP") {
      this.startDrawPolygon();
    } else if (type == "pointP") {
      this.startDrawPoint();
    }
  }

  // 开始划线
  startDrawLine() {
    this.drawLayer.startDraw({
      type: "polylineP",
      style: {
        color: "#55ff33",
        width: 3,
        label: {
          font_size: 18,
          color: "#ffffff",
        },
        clampToGround: true,
      },

    });
  }
  // 开始画面
  startDrawPolygon() {
    this.drawLayer.startDraw({
      type: "polygonP",
      style: {
        color: "#29cf34",
        opacity: 0.5,
        outline: true,
        outlineWidth: 3,
        outlineColor: "#ffffff",
        clampToGround: true,
      },
      // success: function () {
      //   callBack();
      // },
    });
  }
  // 开始画点
  startDrawPoint() {
    this.drawLayer.startDraw({
      type: "pointP",
      style: {
        color: "#00ffff",
        pixelSize: 8,
        outlineColor: "#ffffff",
        outlineWidth: 2,
        label: {
          text: "可以同时支持文字",
          font_size: 20,
          color: "#ffffff",
          outline: true,
          outlineColor: "#000000",
          pixelOffsetY: -20
        }
      }
    })
  }
  // 右键菜单
  bindLayerContextMenu() {
    const that = this;
    that.drawLayer.bindContextMenu([
      {
        text: "开始编辑对象",
        icon: "fa fa-edit",
        show: function (e) {
          const graphic = e.graphic;
          if (!graphic || !graphic.hasEdit) {
            return false;
          }
          return !graphic.isEditing;
        },
        callback: (e) => {
          const graphic = e.graphic;
          if (!graphic) {
            return false;
          }
          if (graphic) {
            store.setCurrentWidget(graphic);
            that.drawLayer.startEditing(graphic);
          }
        },
      },
      {
        text: "停止编辑对象",
        icon: "fa fa-edit",
        show: function (e) {
          const graphic = e.graphic;
          if (!graphic || !graphic.hasEdit) {
            return false;
          }
          return graphic.isEditing;
        },
        callback: (e) => {
          const graphic = e.graphic;
          if (!graphic) {
            return false;
          }
          if (graphic) {
            store.setCurrentWidget("");
            graphic.stopEditing();
          }
        },
      },
      {
        text: "删除对象",
        icon: "fa fa-trash-o",
        show: (event) => {
          const graphic = event.graphic;
          if (!graphic || graphic.isDestroy) {
            return false;
          } else {
            return true;
          }
        },
        callback: (e) => {
          const graphic = e.graphic;
          if (!graphic) {
            return;
          }
          const parent = graphic.parent; // 右击是编辑点时
          that.drawLayer.removeGraphic(graphic);
          if (parent) {
            that.drawLayer.removeGraphic(parent);
          }
          store.setCurrentWidget("");
        },
      },
    ]);
  }
}
