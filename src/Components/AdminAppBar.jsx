import React, { useState } from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import { GrMoreVertical as MoreVerticalIcon } from "react-icons/gr";

import MeterStatusbar from "./MeterStatusbar";
import MeterSearchbar from "./MeterSearchbar";
import QueryDialog from "./QueryDialog";
import UserStatus from "./UserStatus";

const useStyles = makeStyles((theme) => ({
  menuButton: {
    marginRight: theme.spacing(1),
  },
  title: {
    flexGrow: 1,
  },
}));

const AdminAppBar = ({ title }) => {
  const classes = useStyles();
  const [queryDialogOpen, setQueryDialogOpen] = useState(false);
  return (
    <AppBar position="static">
      <Toolbar color="primary">
        <Typography variant="h4" className={classes.title} component="span">
          {title}
        </Typography>
        <MeterSearchbar />
        <MeterStatusbar />
        <IconButton
          onClick={() => setQueryDialogOpen(true)}
          edge="start"
          className={classes.menuButton}
          color="inherit"
          aria-label="menu"
        >
          <MoreVerticalIcon />
        </IconButton>
        <QueryDialog
          open={queryDialogOpen}
          onClose={() => setQueryDialogOpen(false)}
        />
        <UserStatus />
      </Toolbar>
    </AppBar>
  );
};

export default AdminAppBar;
