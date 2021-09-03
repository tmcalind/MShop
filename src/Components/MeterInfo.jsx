import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setObjectId, setObjectIdSelected } from "../slices/featureSlice";

import { queryFeatures } from "@esri/arcgis-rest-feature-layer";
import { alpha, makeStyles } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import { FiX as ClearIcon, FiMap as MapIcon } from "react-icons/fi";
import {
  GrScheduleNew as ScheduleIcon,
  GrDocumentUpdate as UpdateIcon,
  GrEdit as EditIcon,
  GrPrint as PrintIcon,
} from "react-icons/gr";

import { WATER_METER_ADDRESSES_FEATURE_SERVER_URL } from "../config";
import CardContent from "@material-ui/core/CardContent";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    backgroundColor: theme.palette.background.paper,
  },
  card: {
    flexGrow: 1,
  },
  smallavatar: {
    width: theme.spacing(3),
    height: theme.spacing(3),
  },
  largeavatar: {
    width: theme.spacing(7),
    height: theme.spacing(7),
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  search: {
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.25),
    "&:hover": {
      backgroundColor: alpha(theme.palette.common.white, 0.35),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(3),
      width: "auto",
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  inputRoot: {
    color: "inherit",
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
}));

function MeterAvatarIcon({ status }) {
  const classes = useStyles();

  const getImage = (status) => {
    let src = "./mshop/assets/WaterMeter_Marked.png";

    switch (status) {
      case "Marked":
        src = "./mshop/assets/WaterMeter_Marked.png";
        break;

      case "Letter1":
        src = "./mshop/assets/WaterMeter_Letter1.png";
        break;

      case "Letter2":
        src = "./mshop/assets/WaterMeter_Letter2.png";
        break;

      case "Letter3":
        src = "./mshop/assets/WaterMeter_Letter3.png";
        break;

      case "Letter4":
        src = "./mshop/assets/WaterMeter_Letter4.png";
        break;

      case "Scheduled":
        src = "./mshop/assets/WaterMeter_Scheduled.png";
        break;

      default:
        src = "./mshop/assets/WaterMeter_InService.png";
    }

    return src;
  };

  return (
    <Avatar
      alt={status}
      src={getImage(status)}
      className={classes.largeavatar}
    />
  );
}

const MeterInfo = () => {
  const classes = useStyles();

  const dispatch = useDispatch();

  const [meter, setMeter] = useState(null);

  const objectId = useSelector((state) => state.feature.objectId);
  // const objectIdSelected = useSelector((state) => state.feature.objectIdSelected);

  useEffect(() => {
    // fetch feature info
    if (objectId) {
      queryFeatures({
        url: WATER_METER_ADDRESSES_FEATURE_SERVER_URL,
        objectIds: [objectId],
      }).then((response) => {
        setMeter(response.features[0].attributes);
      });
    }

  }, [objectId]);

  const mapGoToClickHandler = () => {
    dispatch(setObjectIdSelected(meter.OBJECTID))
  }

  const clearClickHandler = () => {
    dispatch(setObjectId(null));
  }

  return (
    <div>
      {objectId && meter ? (
        <>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <Card
                className={classes.card}
                variant="outlined"
                style={{
                  paddingLeft: "10px",
                  paddingRight: "10px",
                  paddingBottom: "10px",
                }}
              >
                <CardHeader
                  avatar={<MeterAvatarIcon status={meter.Status} />}
                  title={meter.MeterNumber}
                  subheader={meter.MeterType + " by " + meter.Manufacturer}
                  action={
                    <>
                      <IconButton
                        onClick={mapGoToClickHandler}
                        className={classes.menuButton}
                        edge="start"
                        color="inherit"
                      >
                        <MapIcon />
                      </IconButton>
                      <IconButton>
                        <PrintIcon />
                      </IconButton>
                      <IconButton>
                        <UpdateIcon />
                      </IconButton>
                      <IconButton>
                        <ScheduleIcon />
                      </IconButton>
                      <IconButton>
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={clearClickHandler}>
                        <ClearIcon />
                      </IconButton>
                    </>
                  }
                />

                <Grid container spacing={1}>
                  <Grid item xs={4}>
                    <Card>
                      <CardContent>{meter.InstallDate}</CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={4}>
                    <Card>
                      <CardContent>{meter.PremiseAddress}</CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={4}>
                    <Card>
                      <CardContent>{meter.Status}</CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </Card>
            </Grid>
          </Grid>
        </>
      ) : (
        <>
          <Grid container spacing={0}>
            <Grid item xs={4}></Grid>
            <Grid item xs={4}></Grid>
            <Grid item xs={4}></Grid>
          </Grid>
        </>
      )}
    </div>
  );
};

export default MeterInfo;
