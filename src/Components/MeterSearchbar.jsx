import React, { useState } from "react";

import { alpha, makeStyles } from "@material-ui/core/styles";
import SearchIcon from "@material-ui/icons/Search";
import Toolbar from "@material-ui/core/Toolbar";
import InputBase from "@material-ui/core/InputBase";

import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";

const useStyles = makeStyles((theme) => ({
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

const isWaterMeter = (searchTerm) => {
  let result = false;
  if (searchTerm.charAt(0).toUpperCase() === "W") {
    result = true;
  }

  return result;
};

const isAddress = (searchTerm) => {
  let result = false;

  const hasPos = searchTerm.indexOf(" ") > -1;
  if (hasPos) {
    const items = searchTerm.split(" ");
    if (items.length > 1) {
      if (items[0].valueOf() > 0) {
        result = true;
      }
    }
  }

  return result;
};






const MeterSearchbar = () => {
  const classes = useStyles();

  const [searchTerm, setSearchTerm] = useState('W');

  const getSomeMeters = (partialMeterNumber) => {
    console.log(`partialMeterNumber`, partialMeterNumber)
    return someMeters;
  }

  const [ partialMeterList, setPartialMeterList ] = useState([]);

  const searchTermChangeHandler = (e) => {

    setSearchTerm(e.target.value);
    

    if (isWaterMeter(e.target.value)) {

      console.log("isWaterMeter", e.target.value, searchTerm);

      // queryFeatures({
      //   url: WATER_METER_ADDRESSES_FEATURE_SERVER_URL,
      //   where: "Status = 'Marked'",
      // }).then((response) => {
      //   const objIds = response.features.map((item) => item.attributes.OBJECTID);
      //   dispatch(setObjectIdList(objIds));
  
      //   dispatch(setObjectIdListSelected([]));
      // });



    } else if (isAddress(e.target.value)) {
      console.log("isAddress", e.target.value);
    } else {
      console.log("unknown");
    }
  };

  const someMeters = [
    { MeterNumber: 'W12345'},
    { MeterNumber: 'W12000'},
    { MeterNumber: 'W12145'},
    { MeterNumber: 'W12245'}
  ]


  return (
    <Toolbar>
      <div className={classes.search}>
        <div className={classes.searchIcon}>
          <SearchIcon />
        </div>
        <InputBase
          onChange={searchTermChangeHandler}
          placeholder="Meter # or Address"
          classes={{
            root: classes.inputRoot,
            input: classes.inputInput,
          }}
          inputProps={{ "aria-label": "search" }}
        />
        <Autocomplete
          value={searchTerm}
          options={someMeters}
          getOptionLabel={(option) => option.MeterNumber}
          style={{ width: 300 }}
          renderInput={(params) => (
            <TextField {...params} label="Combo box" variant="outlined" />
          )}
        />
      </div>
    </Toolbar>
  );
};

export default MeterSearchbar;

