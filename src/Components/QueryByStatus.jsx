import React from "react";

import { useDispatch } from "react-redux";
import { setObjectIdList } from "../slices/featureSlice";
import Grid from "@material-ui/core/Grid";
import { queryFeatures } from "@esri/arcgis-rest-feature-layer";

import Button from "@material-ui/core/Button";

const QueryByStatus = ({ closeWhenComplete }) => {
  const dispatch = useDispatch();

  const onSubmitQueryByStatus = (status) => {
    console.log("onSubmitQueryByStatus", status);

    queryFeatures({
      url: "https://citymapdev/arcgisa/rest/services/WaterMeters/FeatureServer/0",
      where: "Status = '" + status + "'",
    }).then((response) => {
      const objIds = response.features.map((item) => item.attributes.OBJECTID);
      dispatch(setObjectIdList(objIds));

      closeWhenComplete(true);
    });
  };

  return (
    <>
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <p>
            <Button
              onClick={() => onSubmitQueryByStatus("Marked")}
              color="primary"
            >
              Marked
            </Button>
          </p>
          <p>
            <Button
              onClick={() => onSubmitQueryByStatus("Letter1")}
              color="primary"
            >
              Letter1
            </Button>
          </p>
          <p>
            <Button
              onClick={() => onSubmitQueryByStatus("Letter2")}
              color="primary"
            >
              Letter2
            </Button>
          </p>
          <p>
            <Button
              onClick={() => onSubmitQueryByStatus("Scheduled")}
              color="primary"
            >
              Scheduled
            </Button>
          </p>
        </Grid>
      </Grid>
    </>
  );
};

export default QueryByStatus;
