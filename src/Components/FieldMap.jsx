import React, { useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { setObjectId } from "../slices/featureSlice";
import { setCenterscale } from "../slices/mapviewSlice";

import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import WebMap from "@arcgis/core/WebMap";

import UniqueValueRenderer from "@arcgis/core/renderers/UniqueValueRenderer";
import MapView from "@arcgis/core/views/MapView";
import esriConfig from "@arcgis/core/config.js";

import "@arcgis/core/assets/esri/themes/light/main.css";

import {
  ESRI_CONFIG_ASSETS_PATH,
  ESRI_CONFIG_PORTAL_URL,
  ESRI_CONFIG_API_KEY,
  WATER_METER_ADDRESSES_FEATURE_SERVER_URL,
} from "../config";

const FieldMap = ({ basemap, height, width, center, scale }) => {
  esriConfig.assetsPath = ESRI_CONFIG_ASSETS_PATH;
  esriConfig.portalUrl = ESRI_CONFIG_PORTAL_URL;
  esriConfig.apiKey = ESRI_CONFIG_API_KEY;

  const objectId = useSelector((state) => state.feature.objectId);

  const mapDiv = useRef(null);

  const dispatch = useDispatch();

  let map;
  const mapRef = useRef(map);

  useEffect(() => {
    if (mapDiv.current) {
      if (basemap === "LONDON_BASEMAP") {
        mapRef.current = new WebMap({
          portalItem: {
            id: "9616afa1c77d4654950a53d519765442",
          },
        });
      } else {
        mapRef.current = new WebMap({ basemap });
      }

      const view = new MapView({
        map: mapRef.current,
        container: mapDiv.current,
        center,
        scale,
      });

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
      waterMeterLabelArcade +=
        "var premiseAddressLine = $feature.PREMISEADDRESS;";
      waterMeterLabelArcade += "var installed = $feature.INSTALLDATE;";
      waterMeterLabelArcade +=
        "var inServiceYears = DateDiff(Now(), installed, 'years');";
      waterMeterLabelArcade +=
        "var inServiceLine = 'In service ' + Round(inServiceYears) + ' yrs';";
      waterMeterLabelArcade +=
        "var labels = [ meterNumberLine, premiseAddressLine, inServiceLine ];";
      waterMeterLabelArcade +=
        "return Concatenate(labels, TextFormatting.NewLine);";

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
        labelingInfo: [waterMeterLabelingInfo],
        minScale: 50000,
        definitionExpression: "Status = 'Scheduled'",
      });

      mapRef.current.add(waterMetersFeatureLayer);

      view.whenLayerView(waterMetersFeatureLayer).then(() => {
        view.on("click", (event) => {
          view.hitTest(event).then((event) => {
            if (event.results) {
              event.results.forEach((result) => {
                if (result.graphic.layer.name === "WaterMeters") {
                  const attribs = result.graphic.attributes;
                  dispatch(setObjectId(attribs.OBJECTID));

                  dispatch(
                    setCenterscale({
                      longitude: view.center.longitude,
                      latitude: view.center.latitude,
                      scale: view.scale,
                    })
                  );
                }
              });
            }
          });
        });
      });
    }
  }, [dispatch, basemap, height, width, center, scale]);

  return (
    <>
      <div className="mapDiv" ref={mapDiv} style={{ width, height }}></div>
    </>
  );
};

export default FieldMap;
