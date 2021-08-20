import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setAuth, setRoles } from "../slices/userSlice";
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
import * as Cookies from "js-cookie";

import { AUTH0_DOMAIN } from "../config";

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

  const auth = useSelector((state) => state.user.auth);
  const roles = useSelector((state) => state.user.roles);

  console.log('auth, roles', auth, roles)


  const dispatch = useDispatch();

  const {
    isAuthenticated,
    isLoading,
    user,
    loginWithRedirect,
    logout,
    getAccessTokenSilently,
  } = useAuth0();

  const [userMetadata, setUserMetadata] = useState(null);

  useEffect(() => {
    const getUserMetadata = async () => {
      try {
        const accessToken = await getAccessTokenSilently({
          audience: `https://${AUTH0_DOMAIN}/api/v2/`,
          scope: "read:current_user",
        });

        if (user.sub) {
          const userDetailsByIdUrl = `https://${AUTH0_DOMAIN}/api/v2/users/${user.sub}`;

          const metadataResponse = await fetch(userDetailsByIdUrl, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });

          const { user_metadata } = await metadataResponse.json();

          dispatch(setRoles(user_metadata));
          dispatch(setAuth(user));

          // const cookieContent = { ...user, ...user_metadata };
          //Cookies.set('MShopAuth', user)

        }
      } catch (e) {
        console.log(`useEffect getUserMetadata error: `, e.message);
      }
    };

    if (user) {
      getUserMetadata();
    }
    
  }, [getAccessTokenSilently, user]);

  //   const [queryDialogOpen, setQueryDialogOpen] = useState(false);

  const showProfile = (e, u) => {
    console.log("showProfile click", e, u, user);

    dispatch(setAuth(user));
  };

  const userLogin = () => {
    loginWithRedirect()

    if (user) {
      dispatch(setAuth(user));
    }
  };

  return (
    <AppBar position="static">

      <Toolbar color="primary">

        {auth ? (<h4>Authenticated</h4>):(<h4>Unauthenticated</h4>)}


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
                {/* <MeterStatusbar /> */}
                <Card>
                  <CardHeader
                    style={{ padding: "4px" }}
                    avatar={
                      <Avatar onClick={(e, user) => showProfile(e, user)}>
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
                        onClick={userLogin}
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
