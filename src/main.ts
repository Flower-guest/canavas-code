import { createApp } from "vue";
import App from "./App.vue";
import route from "./router";
import pinia from "./store";
import pluginMain from "./plugins";
import MarsUIInstall from "./components/marsUI";
import './assets/iconfont/iconfont.js';

import "virtual:uno.css";

//引入cesium基础库
import "mars3d-cesium/Build/Cesium/Widgets/widgets.css";

//导入mars3d主库
import "mars3d/dist/mars3d.css";

const app = createApp(App);
pluginMain(app);
MarsUIInstall(app, {
  dialog: {
    position: {
      left: 50,
      bottom: 50,
    },
    warpper: "#mars-main-view",
  },
});
app.use(route).use(pinia).mount("#app");
