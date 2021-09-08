import React from 'react'

import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import UserStatus from "./UserStatus"

const useStyles = makeStyles((theme) => ({
    menuButton: {
      marginRight: theme.spacing(1),
    },
    title: {
      flexGrow: 1,
    },
  }));

const PlumberAppBar = ({ title }) => {

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
    )
}


export default PlumberAppBar
