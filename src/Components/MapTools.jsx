import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import WebMap from "@arcgis/core/WebMap";
import UniqueValueRenderer from "@arcgis/core/renderers/UniqueValueRenderer";
import esriConfig from "@arcgis/core/config.js";
import "@arcgis/core/assets/esri/themes/light/main.css";
import {
  ESRI_CONFIG_ASSETS_PATH,
  ESRI_CONFIG_PORTAL_URL,
  ESRI_CONFIG_API_KEY,
  WATER_METER_ADDRESSES_FEATURE_SERVER_URL,
  ASSETS_BASEURL,
} from "../config";

esriConfig.assetsPath = ESRI_CONFIG_ASSETS_PATH;
esriConfig.portalUrl = ESRI_CONFIG_PORTAL_URL;
esriConfig.apiKey = ESRI_CONFIG_API_KEY;

const inServiceGreen = [17, 102, 0];
const markedBlue = [0, 38, 230];
const letter1Yellow = [255, 255, 0];
const letter2Orange = [255, 187, 51];
const letter3OrangeRed = [255, 153, 102];
const letter4RedOrange = [255, 143, 80];
const scheduledBlack = [0, 0, 0];
const symbolOpacity = 0.1;
const symbolSize = 8;
const symbolOutlineWidth = 3;

const waterMeterRenderer = new UniqueValueRenderer({
  field: "Status",
  defaultSymbol: { type: "simple-marker" },
  uniqueValueInfos: [
    {
      value: "InService",
      type: "simple",

      symbol: {
        type: "simple-marker",
        size: symbolSize,
        color: [...inServiceGreen, symbolOpacity],
        outline: {
          width: symbolOutlineWidth,
          color: [...inServiceGreen, symbolOpacity],
        },
      },
    },
    {
      value: "Marked",
      type: "simple",
      symbol: {
        type: "simple-marker",
        size: symbolSize,
        color: [...markedBlue, symbolOpacity],
        outline: {
          width: symbolOutlineWidth,
          color: [...markedBlue, symbolOpacity],
        },
      },
    },
    {
      value: "Letter1",
      type: "simple",
      symbol: {
        type: "simple-marker",
        size: symbolSize,
        color: [...letter1Yellow, symbolOpacity],
        outline: {
          width: symbolOutlineWidth,
          color: [...markedBlue, symbolOpacity],
        },
      },
    },
    {
      value: "Letter2",
      type: "simple",
      symbol: {
        type: "simple-marker",
        size: symbolSize,
        color: [...letter2Orange, symbolOpacity],
        outline: {
          width: symbolOutlineWidth,
          color: [...markedBlue, symbolOpacity],
        },
      },
    },
    {
      value: "Letter3",
      type: "simple",
      symbol: {
        type: "simple-marker",
        size: symbolSize,
        color: [...letter3OrangeRed, symbolOpacity],
        outline: {
          width: symbolOutlineWidth,
          color: [...markedBlue, symbolOpacity],
        },
      },
    },
    {
      value: "Letter4",
      type: "simple",
      symbol: {
        type: "simple-marker",
        size: symbolSize,
        color: [...letter4RedOrange, symbolOpacity],
        outline: {
          width: symbolOutlineWidth,
          color: [...markedBlue, symbolOpacity],
        },
      },
    },
    {
      value: "ShutoffNotice",
      type: "simple",
      symbol: {
        type: "simple-marker",
        size: symbolSize,
        color: [...letter4RedOrange, symbolOpacity],
        outline: {
          width: symbolOutlineWidth,
          color: [...markedBlue, symbolOpacity],
        },
      },
    },
    {
      value: "Scheduled",
      type: "simple",
      symbol: {
        type: "simple-marker",
        size: symbolSize,
        color: [...scheduledBlack, symbolOpacity],
        outline: {
          width: symbolOutlineWidth,
          color: [...scheduledBlack, symbolOpacity],
        },
      },
    },
  ],
});

let waterMeterLabelArcade = "var meterNumberLine = $feature.METERNUMBER;";
waterMeterLabelArcade += "var premiseAddressLine = $feature.PREMISEADDRESS;";
waterMeterLabelArcade += "var installed = $feature.INSTALLDATE;";
waterMeterLabelArcade +=
  "var inServiceYears = DateDiff(Now(), installed, 'years');";
waterMeterLabelArcade +=
  "var inServiceLine = 'In service ' + Round(inServiceYears) + ' yrs';";
waterMeterLabelArcade +=
  "var labels = [ meterNumberLine, premiseAddressLine, inServiceLine ];";
waterMeterLabelArcade += "return Concatenate(labels, TextFormatting.NewLine);";

const waterMeterLabelingInfo = {
  labelExpressionInfo: {
    expression: waterMeterLabelArcade,
  },
  labelPlacement: "center-right",
  symbol: {
    type: "text", // autocasts as new TextSymbol()
    font: {
      size: 9,
      family: "Noto Sans",
    },
    horizontalAlignment: "left",
    color: "#2b2b2b",
  },
  minScale: 6000,
};

let meterStatusLabelArcade = "var meterStatus = $feature.STATUS;";
meterStatusLabelArcade += "var meterStatusDate = Text($feature.STATUSDATE, 'Y-MM-DD');";
meterStatusLabelArcade += "var labels = [ meterStatus, meterStatusDate ];";
meterStatusLabelArcade += "return Concatenate(labels, TextFormatting.NewLine);";

const meterStatusLabelingInfo = {
  labelExpressionInfo: {
    expression: meterStatusLabelArcade,
  },
  labelPlacement: "center-left",
  symbol: {
    type: "text", // autocasts as new TextSymbol()
    font: {
      size: 9,
      family: "Noto Sans",
    },
    horizontalAlignment: "left",
    color: "#33cc33", // green
  },
  minScale: 6000,
};

export const createMap = (basemap) => {
  let map;
  if (basemap === "LONDON_BASEMAP") {
    map = new WebMap({
      portalItem: {
        id: "9616afa1c77d4654950a53d519765442",
      },
    });
  } else {
    map = new WebMap({ basemap });
  }

  return map;
};

export const getMetersFeatureLayer = () => {
  const waterMetersFeatureLayer = new FeatureLayer({
    url: WATER_METER_ADDRESSES_FEATURE_SERVER_URL,
    spatialReference: 26917,
    name: "WaterMeters",
    title: "Water Meters",
    outFields: [
      "OBJECTID",
      "MeterNumber",
      "Manufacturer",
      "MeterType",
      "InstallDate",
      "Status",
      "PremiseAddress",
    ],
    renderer: waterMeterRenderer,
    minScale: 5000,
    labelingInfo: [
      waterMeterLabelingInfo,
      meterStatusLabelingInfo
    ],
  });

  const query = waterMetersFeatureLayer.createQuery();

  waterMetersFeatureLayer.queryFeatures(query).then(() => {});

  return waterMetersFeatureLayer;
};

export const getGraphicsLayer = (objectIds, featureLayer, symbol) => {
  let objectIdListGraphicsLayer = new GraphicsLayer();
  if (objectIds && objectIds.length > 0) {
    const query = featureLayer.createQuery();
    query.objectIds = objectIds;

    featureLayer.queryFeatures(query).then((featureSet) => {
      const symbolizedFeatureSet = featureSet.features.map((graphic) => {
        switch (symbol) {
          case "meter":
            let symbolUrl = ASSETS_BASEURL + "/assets/WaterMeter_InService.png";
            if (graphic.attributes.Status === "InService") {
              symbolUrl = ASSETS_BASEURL + "/assets/WaterMeter_InService.png";
            } else if (graphic.attributes.Status === "Letter1") {
              symbolUrl = ASSETS_BASEURL + "/assets/WaterMeter_Letter1.png";
            } else if (graphic.attributes.Status === "Letter2") {
              symbolUrl = ASSETS_BASEURL + "/assets/WaterMeter_Letter2.png";
            } else if (graphic.attributes.Status === "Letter3") {
              symbolUrl = ASSETS_BASEURL + "/assets/WaterMeter_Letter3.png";
            } else if (graphic.attributes.Status === "Letter4") {
              symbolUrl = ASSETS_BASEURL + "/assets/WaterMeter_Letter4.png";
            } else if (graphic.attributes.Status === "Scheduled") {
              symbolUrl = ASSETS_BASEURL + "/assets/WaterMeter_Scheduled.png";
            }

            graphic.symbol = {
              type: "picture-marker",
              url: symbolUrl,
              width: "40px",
              height: "25px",
            };
            break;

          case "searched":
            graphic.symbol = {
              type: "simple-marker",
              style: "diamond",
              size: 10,
              color: "blue",
            };
            break;
          case "selected":
          default:
            graphic.symbol = {
              type: "simple-marker",
              style: "diamond",
              size: 10,
              color: "red",
            };
            break;
          
        }
        return graphic;
      });
      objectIdListGraphicsLayer.graphics.addMany(symbolizedFeatureSet);
    });
  }
  return objectIdListGraphicsLayer;
};
