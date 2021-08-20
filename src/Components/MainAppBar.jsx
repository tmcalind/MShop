import React from "react";

import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar"
import Typography from "@material-ui/core/Typography";

import { makeStyles } from "@material-ui/core/styles";

import UserStatus from './UserStatus'

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    width: "100%",
    height: "100%",
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary,
  },
  menuButton: {
    marginRight: theme.spacing(1),
  },
  title: {
    flexGrow: 1,
  },
}));

const MainAppBar = ({ title }) => {

  const classes = useStyles();

  return (
    <AppBar position="static">
      <Toolbar color="primary">
        <Typography variant="h4" className={classes.title} component="span">
          {title}
        </Typography>
        <UserStatus />
      </Toolbar>
    </AppBar>
  );
};

export default MainAppBar;
