import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import BottomNavigation from "@material-ui/core/BottomNavigation";
import BottomNavigationAction from "@material-ui/core/BottomNavigationAction";
import RestoreIcon from "@material-ui/icons/Restore";
import LocationOnIcon from "@material-ui/icons/LocationOn";

const useStyles = makeStyles({
  root: {
    width: 400,
  },
});

const FieldBottomNav = () => {
  const classes = useStyles();
  const [value, setValue] = useState("mytasks");

  return (
    <BottomNavigation
      value={value}
      onChange={(event, newValue) => {
        setValue(newValue);

        console.log(newValue);
      }}
      showLabels
      className={classes.root}
    >
      <BottomNavigationAction
        label="My Tasks"
        icon={<RestoreIcon />}
        value="mytasks"
      />
      <BottomNavigationAction
        label="All Tasks"
        icon={<LocationOnIcon />}
        value="alltasks"
      />
    </BottomNavigation>
  );
};

export default FieldBottomNav;
