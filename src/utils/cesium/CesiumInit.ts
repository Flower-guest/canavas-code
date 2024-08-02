/*
 * @Author: cxj 1481240653@qq.com
 * @Date: 2023-11-04 14:17:02
 * @LastEditors: cxj 1481240653@qq.com
 * @LastEditTime: 2024-08-02 10:06:55
 * @FilePath: \country-3d-platform-mars3d\src\utils\cesium\CesiumInit.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import * as mars3d from "mars3d";
import DrawUnit from "./Draw"; //绘制
import { map3dConfig, CESIUM_ID } from "@/const/cesiumConfig";
import "@/assets/css/cesiumNavigation.css";

class CesiumInit {
  map3d: any;
  drawUnit: any;
  constructor() {
    this.initMap();
    this.initDataEvent();
  }
  // 初始化地图
  initMap() {
    this.map3d = new mars3d.Map(CESIUM_ID, map3dConfig);
    this.map3d.unbindContextMenu(); //解除绑定的右键菜单
    this.map3d.on(mars3d.EventType.renderError, () => {
      window.location.reload();
    });
  }
  // 初始化数据和事件
  initDataEvent() {
    // 初始化划线画面
    this.drawUnit = new DrawUnit(this.map3d);
  }
  // 地球自转
  async loadData() {
    // 开场动画
    this.map3d.openFlyAnimation({
      callback: function () {
        window.info.scene_camera ? this.flyToPoint(window.info.scene_camera) : this.mars3d.flyHome();
      }
    })
  }

  flyToPoint(option) {
    option && this.map3d.flyToPoint([option.lng, option.lat], {
      ...option,
      radius: option.alt, // 距离目标点的距离
      lock: option?.lock ?? true, //是否是trackedEntity锁定视角状态
    });
  }
}

export default CesiumInit;
