import React, { useState } from "react";

import { useDispatch } from "react-redux";
import {
  setObjectIdList,
  setObjectIdListSelected,
} from "../slices/featureSlice";

import { queryFeatures } from "@esri/arcgis-rest-feature-layer";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import { WATER_METER_ADDRESSES_FEATURE_SERVER_URL } from "../config";

const QueryByAttributes = ({ closeWhenComplete }) => {
  const dispatch = useDispatch();

  const [meterAge, setMeterAge] = useState(1995);

  const onSubmitQueryByAttributes = () => {
    console.log("onSubmitQueryByAttributes", meterAge);

    queryFeatures({
      url: WATER_METER_ADDRESSES_FEATURE_SERVER_URL,
      where: "InstallDate < '" + meterAge + "'",
    }).then((response) => {
      const objIds = response.features.map((item) => item.attributes.OBJECTID);
      dispatch(setObjectIdList(objIds));

      dispatch(setObjectIdListSelected([]));

      closeWhenComplete(true);
    });
  };

  return (
    <>
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <TextField
            id="standard-basic"
            label="Installed before (year)"
            onChange={(e) => setMeterAge(e.target.value)}
            value={meterAge}
          />
        </Grid>
        <Grid item xs={12}>
          <Button onClick={onSubmitQueryByAttributes} color="primary">
            Query by Attributes
          </Button>
        </Grid>
      </Grid>
    </>
  );
};

export default QueryByAttributes;
