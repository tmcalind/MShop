import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { queryFeatures } from "@esri/arcgis-rest-feature-layer";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";

import FormControlLabel from "@material-ui/core/FormControlLabel";

import Checkbox from "@material-ui/core/Checkbox";
import Typography from '@material-ui/core/Typography';

import { WATER_METER_ADDRESSES_FEATURE_SERVER_URL } from "../config";
import Button from "@material-ui/core/Button";

const PrintDialog = ({ onClose, open }) => {
  const objectIdListSelected = useSelector(
    (state) => state.feature.objectIdListSelected
  );

  const [meters, setMeters] = useState([]);

  const [ updateBefore, setUpdateBefore ] = useState(true);

  useEffect(() => {
    queryFeatures({
      url: WATER_METER_ADDRESSES_FEATURE_SERVER_URL,
      objectIds: objectIdListSelected,
    }).then((response) => {
      const featureAttributes = response.features.map(
        (item) => item.attributes
      );
      setMeters(featureAttributes);
    });
  }, [objectIdListSelected]);

  return (
    <Dialog open={open} onClose={() => onClose()}>
      <DialogTitle>Print</DialogTitle>
      <DialogContent>
        <FormControlLabel
          control={
            <Checkbox checked={updateBefore} onChange={(e) => setUpdateBefore(e.target.checked)} />
          }
          label="Update 'Status' before printing?"
        />
      </DialogContent>
      <DialogContent>
      {updateBefore ? (<p>The meter status will be updated before printing.</p>) : (<p>The meter status will NOT be updated before printing.</p>)}
      <Typography gutterBottom>
          <b>{meters.length}</b> items selected for printing.
          </Typography>
          
      </DialogContent>
      <DialogActions>
        <Button>Print</Button>
        <Button onClick={() => onClose()}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
};

export default PrintDialog;
