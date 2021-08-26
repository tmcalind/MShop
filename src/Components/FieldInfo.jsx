import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { queryFeatures } from "@esri/arcgis-rest-feature-layer";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import Grid from "@material-ui/core/Grid";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";

import { RiBarcodeLine as BarcodeIcon } from "react-icons/ri";
import { AiFillCamera as CameraIcon } from "react-icons/ai";
import { GrEdit as EditIcon } from "react-icons/gr";
import { FaWrench as WrenchIcon } from "react-icons/fa";

import { WATER_METER_ADDRESSES_FEATURE_SERVER_URL } from "../config";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    backgroundColor: theme.palette.background.paper,
  },
  card: {
    flexGrow: 1,
  },
}));
const FieldInfo = () => {
  const classes = useStyles();

  const [meter, setMeter] = useState(null);

  const objectId = useSelector((state) => state.feature.objectId);

  useEffect(() => {
    // fetch feature info
    queryFeatures({
      url: WATER_METER_ADDRESSES_FEATURE_SERVER_URL,
      objectIds: [objectId],
    }).then((response) => {
      setMeter(response.features[0].attributes);
    });
  }, [objectId]);

  // console.log(meter);

  return (
    <div>
      {objectId && meter ? (
        <>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <Card className={classes.card} variant="outlined">
                <CardContent>
                  <Typography
                    className={classes.title}
                    color="textSecondary"
                    gutterBottom
                  >
                    {meter.MeterNumber}
                  </Typography>
                  <Typography variant="h5" component="h2">
                    {meter.PremiseAddress}
                  </Typography>

                  <Typography variant="body2" component="p">
                    {meter.Status}
                  </Typography>
                </CardContent>
                <CardActions>
                  <IconButton>
                    <WrenchIcon />
                  </IconButton>
                  <IconButton>
                    <BarcodeIcon />
                  </IconButton>
                  <IconButton>
                    <CameraIcon />
                  </IconButton>
                  <IconButton>
                    <EditIcon />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          </Grid>
        </>
      ) : (
        <></>
      )}
    </div>
  );
};

export default FieldInfo;
