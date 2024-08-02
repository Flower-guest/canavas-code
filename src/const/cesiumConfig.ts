import * as mars3d from "mars3d";
import * as Cesium from "mars3d-cesium";
// 加载cesium的domId
export const CESIUM_ID = "cesiumContainer";

export const map3dConfig: any = {
  scene: {
    center: { lat: 27.993744, lng: 113.109659, alt: 69659 },
    contextOptions: {
      webgl: {
        preserveDrawingBuffer: true,
      },
    },
    clock: { multiplier: 200 },
    shadows: false,
    removeDblClick: true,
    sceneMode: 3,
    showSun: true,
    showMoon: true,
    showSkyBox: true,
    showSkyAtmosphere: true,
    fog: true,
    fxaa: true,
    requestRenderMode: true, // 显式渲染
    globe: {
      depthTestAgainstTerrain: false,
      baseColor: "#546a53",
      showGroundAtmosphere: true,
      enableLighting: false,
    },
    cameraController: {
      zoomFactor: 3,
      minimumZoomDistance: 1,
      maximumZoomDistance: 5e7,
      enableRotate: true,
      enableTranslate: true,
      enableTilt: true,
      enableZoom: true,
      enableCollisionDetection: true,
    },
  },
  control: {
    baseLayerPicker: true,
    homeButton: false,
    sceneModePicker: false,
    navigationHelpButton: false,
    fullscreenButton: false,
    mouseDownView: false,
    terrainProviderViewModels: getTerrainProviderViewModelsArr(),
    locationBar: {
      crs: "CGCS2000_GK_Zone_3",
      crsDecimal: 0,
      template:
        "<div style='color:#707070; margin-top: 6px;'>经度:{lng}    纬度:{lat}    方向：{heading}°    俯仰角：{pitch}°    视高：{cameraHeight}米</div>",
      cacheTime: 50,
    },
  },
  terrain: {
    url: "https://data.mars3d.cn/terrain",
    show: true,
  },
  basemaps: [
    {
      id: 10,
      name: "地图底图",
      type: "group",
      templateValues: {
        dataServer: "//data.mars3d.cn",
        gltfServerUrl: "//data.mars3d.cn/gltf",
      },
      pid: -1,
      opacity: 1,
      zIndex: 0,
    },
    {
      id: 21,
      name: "ArcGIS影像",
      icon: "https://demo.fantere.com/img/esriWorldImagery.png",
      type: "arcgis",
      layer: "img_d",
      enablePickFeatures: false,
      show: true,
    },
    {
      id: 2021,
      pid: 10,
      name: "谷歌影像",
      icon: "https://demo.fantere.com/img/google_img.png",
      type: "google",
      layer: "img_d",
      show: false,
      templateValues: {
        dataServer: "//data.mars3d.cn",
        gltfServerUrl: "//data.mars3d.cn/gltf",
      },
      opacity: 1,
      zIndex: 1,
    },
    {
      id: 1,
      name: "天地图影像",
      icon: "https://demo.fantere.com/img/tdt_img.png",
      type: "tdt",
      layer: "img_d",
      show: false,
    },
    {
      pid: 10,
      name: "百度电子",
      icon: "https://demo.fantere.com/img/bd-vec.png",
      type: "baidu",
      layer: "vec",
      id: 15,
      templateValues: {
        dataServer: "//data.mars3d.cn",
        gltfServerUrl: "//data.mars3d.cn/gltf",
      },
      opacity: 1,
      zIndex: 15,
    },
    {
      id: 2017,
      pid: 10,
      name: "暗色底图",
      type: "gaode",
      icon: "https://demo.fantere.com/img/blackMarble.png",
      layer: "vec",
      invertColor: true,
      filterColor: "#4e70a6",
      brightness: 0.6,
      contrast: 1.8,
      gamma: 0.3,
      hue: 1,
      saturation: 0,
      templateValues: {
        dataServer: "//data.mars3d.cn",
        gltfServerUrl: "//data.mars3d.cn/gltf",
      },
      opacity: 1,
      zIndex: 22,
    },
    {
      pid: 10,
      name: "蓝色底图",
      icon: "https://demo.fantere.com/img/bd-c-midnight.png",
      type: "xyz",
      url: "https://map.geoq.cn/arcgis/rest/services/ChinaOnlineStreetPurplishBlue/MapServer/tile/{z}/{y}/{x}",
      chinaCRS: "GCJ02",
      enablePickFeatures: false,
      id: 23,
      templateValues: {
        dataServer: "//data.mars3d.cn",
        gltfServerUrl: "//data.mars3d.cn/gltf",
      },
      opacity: 1,
      zIndex: 23,
    },
    {
      pid: 10,
      name: "黑色底图",
      icon: "https://demo.fantere.com/img/bd-c-dark.png",
      type: "tencent",
      layer: "custom",
      style: "4",
      id: 24,
      templateValues: {
        dataServer: "//data.mars3d.cn",
        gltfServerUrl: "//data.mars3d.cn/gltf",
      },
      opacity: 1,
      zIndex: 24,
    },
    {
      id: 2023,
      pid: 10,
      name: "无底图",
      type: "grid",
      color: "#000",
      backgroundColor: "rgba(0,0,0,1)",
      opacity: 0.9,
      zIndex: 30,
      show: false,
      templateValues: {
        dataServer: "//data.mars3d.cn",
        gltfServerUrl: "//data.mars3d.cn/gltf",
      },
    },
  ],
  layers: [
    {
      layer: "ibo",
      name: "行政区划界线",
      show: true,
      type: "tdt",
      zIndex: 2,
    },
    {
      layer: "img_z",
      name: "天地图影像注记",
      show: true,
      type: "tdt",
      key: mars3d.Token.tiandituArr,
      zIndex: 2,
    }
  ],
};

function getTerrainProviderViewModelsArr() {
  return [
    new Cesium.ProviderViewModel({
      name: "无地形",
      tooltip: "WGS84标准球体",
      iconUrl: "https://demo.fantere.com/img/TerrainEllipsoid.png",
      creationFunction: function () {
        return mars3d.LayerUtil.getNoTerrainProvider();
      },
    }),
    new Cesium.ProviderViewModel({
      name: "中国地形",
      tooltip: "中国国内地形",
      iconUrl: "https://demo.fantere.com/img/TerrainSTK.png",
      creationFunction: function () {
        return mars3d.LayerUtil.createTerrainProvider({
          url: "https://data.mars3d.cn/terrain",
          type: ""
        })
      }
    }),
    new Cesium.ProviderViewModel({
      name: "ArcGIS地形",
      tooltip: "中国国内地形",
      iconUrl: "https://demo.fantere.com/img/TerrainSTK.png",
      creationFunction: function () {
        return mars3d.LayerUtil.createTerrainProvider({
          type: "arcgis",
          url: "https://elevation3d.arcgis.com/arcgis/rest/services/WorldElevation3D/Terrain3D/ImageServer"
        })
      }
    }),
    new Cesium.ProviderViewModel({
      name: "全球地形",
      tooltip: "由 Cesium官方 提供的高分辨率全球地形",
      iconUrl: "https://demo.fantere.com/img/TerrainSTK.png",
      creationFunction: function () {
        return mars3d.LayerUtil.createTerrainProvider({
          type: "ion",
          requestWaterMask: true,
          requestVertexNormals: true,
          url: ""
        })
      }
    }),
  ];
}

// 加载3dtitles配置
export const dTilesOption = {
  cullWithChildrenBounds: false,
  cacheBytes: 1073741824, // 1024MB = 1024*1024*1024 【重要】额定显存大小(以字节为单位)，允许在这个值上下波动。
  maximumCacheOverflowBytes: 2147483648, // 2048MB = 2048*1024*1024 【重要】最大显存大小(以字节为单位)。
  skipLevelOfDetail: true, //是Cesium在1.5x 引入的一个优化参数，这个参数在金字塔数据加载中，可以跳过一些级别，这样整体的效率会高一些，数据占用也会小一些。但是带来的异常是：1） 加载过程中闪烁，看起来像是透过去了，数据载入完成后正常。2，有些异常的面片，这个还是因为两级LOD之间数据差异较大，导致的。当这个参数设置false，两级之间的变化更平滑，不会跳跃穿透，但是清晰的数据需要更长，而且还有个致命问题，一旦某一个tile数据无法请求到或者失败，导致一直不清晰。所以我们建议：对于网络条件好，并且数据总量较小的情况下，可以设置false，提升数据显示质量。
  cullRequestsWhileMoving: true,
  cullRequestsWhileMovingMultiplier: 10, //【重要】 值越小能够更快的剔除
  preferLeaves: true, //【重要】这个参数默认是false，同等条件下，叶子节点会优先加载。但是Cesium的tile加载优先级有很多考虑条件，这个只是其中之一，如果skipLevelOfDetail=false，这个参数几乎无意义。所以要配合skipLevelOfDetail=true来使用，此时设置preferLeaves=true。这样我们就能最快的看见符合当前视觉精度的块，对于提升大数据以及网络环境不好的前提下有一点点改善意义。
  progressiveResolutionHeightFraction: 0.5, //【重要】 数值偏于0能够让初始加载变得模糊
  dynamicScreenSpaceError: true, // true时会在真正的全屏加载完之后才清晰化模型
  preloadWhenHidden: true, //tileset.show是false时，也去预加载数据
};
