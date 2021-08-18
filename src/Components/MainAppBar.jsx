import React, { useState } from "react"

import { useAuth0 } from "@auth0/auth0-react";
import AppBar from "@material-ui/core/AppBar";
import { Avatar, Card, CardHeader, Toolbar } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
// import MenuIcon from "@material-ui/icons/Menu";
import { makeStyles } from "@material-ui/core/styles";
import { FiLogIn as LoginIcon, FiLogOut as LogoutIcon } from "react-icons/fi";
// import QueryDialog from "./QueryDialog";
// import MeterSearchbar from "./MeterSearchbar";
import MeterStatusbar from "./MeterStatusbar";

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

  const { isAuthenticated, isLoading, user, loginWithRedirect, logout } =
    useAuth0();

//   const [queryDialogOpen, setQueryDialogOpen] = useState(false);

  return (
    <AppBar position="static">
      <Toolbar color="primary">
        {isAuthenticated && (
          <>
            {/* <IconButton
              onClick={() => setQueryDialogOpen(true)}
              edge="start"
              className={classes.menuButton}
              color="inherit"
              aria-label="menu"
            >
              <MenuIcon />
            </IconButton>
            <QueryDialog
              open={queryDialogOpen}
              onClose={() => setQueryDialogOpen(false)}
            /> */}
          </>
        )}

        {/* <MeterSearchbar /> */}

        <Typography variant="h4" className={classes.title} component="span">
          {title}
        </Typography>

        {isLoading ? (
          <>Loading</>
        ) : (
          <>
            {isAuthenticated ? (
              <>
                <MeterStatusbar />
                <Card>
                  <CardHeader
                    style={{ padding: "4px" }}
                    avatar={
                      <Avatar onClick={() => console.log("click")}>
                        {user.name.charAt(0).toUpperCase()}
                      </Avatar>
                    }
                    action={
                      <>
                        <IconButton
                          edge="end"
                          className={classes.menuButton}
                          color="inherit"
                          onClick={() =>
                            logout({ returnTo: window.location.origin })
                          }
                        >
                          <LogoutIcon />
                        </IconButton>
                      </>
                    }
                    title={user.name}
                  />
                </Card>
              </>
            ) : (
              <>
                <Card>
                  <CardHeader
                    style={{ padding: "4px" }}
                    avatar={<Avatar>?</Avatar>}
                    action={
                      <IconButton
                        edge="end"
                        className={classes.menuButton}
                        color="inherit"
                        aria-label="menu"
                        onClick={() => loginWithRedirect()}
                      >
                        <LoginIcon />
                      </IconButton>
                    }
                    title="Login"
                  />
                </Card>
              </>
            )}
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default MainAppBar;
