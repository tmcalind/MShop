import React, { useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setObjectId } from "../slices/featureSlice";

import MapView from "@arcgis/core/views/MapView";

import { createMap, getGraphicsLayer, getMetersFeatureLayer } from "./MapTools";

const MeterMap = ({ basemap, height, width, center, scale }) => {
  const dispatch = useDispatch();
  const objectIdSelected = useSelector(
    (state) => state.feature.objectIdSelected
  );
  const objectIdList = useSelector((state) => state.feature.objectIdList);
  const objectIdListSelected = useSelector(
    (state) => state.feature.objectIdListSelected
  );

  const mapDiv = useRef(null);

  useEffect(() => {
    if (mapDiv.current) {
      const map = createMap(basemap);
      const meterFeatureLayer = getMetersFeatureLayer();

      map.add(meterFeatureLayer);

      const view = new MapView({
        map,
        container: mapDiv.current,
        center,
        scale,
      });

      let listGraphicsLayer,
        selectedListGraphicsLayer,
        searchResultsGraphicsLayer;

      view.whenLayerView(meterFeatureLayer).then(() => {
        if (objectIdList && objectIdList.length > 0) {
          listGraphicsLayer = getGraphicsLayer(
            objectIdList,
            meterFeatureLayer,
            "meter"
          );
          map.add(listGraphicsLayer);
        }

        if (objectIdListSelected && objectIdListSelected.length > 0) {
          selectedListGraphicsLayer = getGraphicsLayer(
            objectIdListSelected,
            meterFeatureLayer,
            "selected"
          );
          map.add(selectedListGraphicsLayer);
        }

        if (objectIdSelected) {
          searchResultsGraphicsLayer = getGraphicsLayer(
            [objectIdSelected],
            meterFeatureLayer,
            "searched"
          );
          map.add(searchResultsGraphicsLayer);
        }

        // if (searchResultsGraphicsLayer) {
        //   console.log('searchResultsGraphicsLayer',searchResultsGraphicsLayer)
        //   view.goTo(searchResultsGraphicsLayer);
        // }

        view.on("click", function (event) {
          view.hitTest(event).then(function (event) {
            if (event.results) {
              event.results.forEach(function (result) {
                if (result.graphic.layer.name === "WaterMeters") {
                  const attribs = result.graphic.attributes;
                  dispatch(setObjectId(attribs.OBJECTID));
                }
              });
            }
          });
        });
      });
    }
  }, [
    dispatch,
    objectIdList,
    objectIdListSelected,
    objectIdSelected,
    basemap,
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
