import React, { useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setObjectId } from "../slices/featureSlice";
import { setCenterscale } from "../slices/mapviewSlice";

import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
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

const MeterMap = ({ basemap, height, width, center, scale }) => {
  esriConfig.assetsPath = ESRI_CONFIG_ASSETS_PATH;
  esriConfig.portalUrl = ESRI_CONFIG_PORTAL_URL;
  esriConfig.apiKey = ESRI_CONFIG_API_KEY;

  const objectIdList = useSelector((state) => state.feature.objectIdList);
  const objectIdListSelected = useSelector(
    (state) => state.feature.objectIdListSelected
  );

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
        minScale: 12000,
      });

      mapRef.current.add(waterMetersFeatureLayer);

      const objectIdListGraphicsLayer = new GraphicsLayer();
      mapRef.current.add(objectIdListGraphicsLayer);

      const objectIdListSelectedGraphicsLayer = new GraphicsLayer();
      mapRef.current.add(objectIdListSelectedGraphicsLayer);

    //   view.whenLayerView(waterMetersFeatureLayer).then(function () {
    //     objectIdListGraphicsLayer.removeAll();

    //     if (objectIdList && objectIdList.length > 0) {
    //       const query = waterMetersFeatureLayer.createQuery();
    //       query.objectIds = objectIdList;

    //       waterMetersFeatureLayer.queryFeatures(query).then((featureSet) => {
    //         const symbolizedFeatureSet = featureSet.features.map((graphic) => {
    //           let symbolUrl = "./assets/WaterMeter_Marked.png";

    //           if (graphic.attributes.Status === "InService") {
    //             symbolUrl = "./assets/WaterMeter_InService.png";
    //           } else if (graphic.attributes.Status === "Letter1") {
    //             symbolUrl = "./assets/WaterMeter_Letter1.png";
    //           } else if (graphic.attributes.Status === "Letter2") {
    //             symbolUrl = "./assets/WaterMeter_Letter2.png";
    //           } else if (graphic.attributes.Status === "Letter3") {
    //             symbolUrl = "./assets/WaterMeter_Letter3.png";
    //           }

    //           graphic.symbol = {
    //             type: "picture-marker",
    //             url: symbolUrl,
    //             width: "40px",
    //             height: "25px",
    //           };

    //           return graphic;
    //         });
    //         objectIdListGraphicsLayer.graphics.addMany(symbolizedFeatureSet);

    //         // console.log(`waterMetersFeatureLayer.queryFeatures`,featureSet)

    //         // Zoom to list items
    //         // view.goTo(objectIdListGraphicsLayer.graphics).catch((err) => console.log(err));
    //       });
    //     }

    //     objectIdListSelectedGraphicsLayer.removeAll();
    //     if (objectIdListSelected && objectIdListSelected.length > 0) {
    //       const query = waterMetersFeatureLayer.createQuery();

    //       query.objectIds = objectIdListSelected;

    //       waterMetersFeatureLayer.queryFeatures(query).then((featureSet) => {
    //         const symbolizedFeatureSet = featureSet.features.map((graphic) => {
    //           graphic.symbol = {
    //             type: "simple-marker",
    //             style: "diamond",
    //             size: 10,
    //             color: "red",
    //           };

    //           return graphic;
    //         });

    //         objectIdListSelectedGraphicsLayer.graphics.addMany(
    //           symbolizedFeatureSet
    //         );
    //       });
    //     }

    //     view.on("click", function (event) {
    //       view.hitTest(event).then(function (event) {
    //         if (event.results) {
    //           event.results.forEach(function (result) {
    //             if (result.graphic.layer.name === "WaterMeters") {
    //               const attribs = result.graphic.attributes;
    //               dispatch(setObjectId(attribs.OBJECTID));

    //               dispatch(
    //                 setCenterscale({
    //                   longitude: view.center.longitude,
    //                   latitude: view.center.latitude,
    //                   scale: view.scale,
    //                 })
    //               );
    //             }
    //           });
    //         }
    //       });
    //     });
    //   });
    }
  }, [
    objectIdList,
    objectIdListSelected,
    dispatch,
    basemap,
    height,
    width,
    center,
    scale,
  ]);

  return (
    <>
      <div className="mapDiv" ref={mapDiv} style={{ width, height }}></div>
    </>
  );
};

export default MeterMap;
