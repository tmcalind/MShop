import React, { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { setAuth, setRoles } from "../slices/userSlice";
import { useDispatch, useSelector } from "react-redux";
import AppBar from "@material-ui/core/AppBar";
import { Avatar, Card, CardHeader, Toolbar } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import MeterStatusbar from "./MeterStatusbar";
import IconButton from "@material-ui/core/IconButton";
import { FiLogIn as LoginIcon, FiLogOut as LogoutIcon } from "react-icons/fi";
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

const AdminAppBar = ({ title }) => {

    const auth = useSelector((state) => state.user.auth);
    const roles = useSelector((state) => state.user.roles);

    console.log('auth, roles', auth, roles)
    const dispatch = useDispatch();

  const classes = useStyles();

  const {
    isAuthenticated,
    isLoading,
    user,
    loginWithRedirect,
    logout,
    getAccessTokenSilently,
  } = useAuth0();

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
        }
      } catch (e) {
        console.log(`useEffect getUserMetadata error: `, e.message);
      }
    };

    

    if (user) {
         getUserMetadata();
      console.log("AdminAppBar useEffect user:", user);
    }
  }, [ getAccessTokenSilently, user]);

  const userLogin = () => {
    loginWithRedirect();
  };

  return (
    <AppBar position="static">
      <Toolbar color="primary">
        <Typography variant="h4" className={classes.title} component="span">
          {title}
        </Typography>
        <MeterStatusbar />
        <IconButton
          onClick={userLogin}
          edge="start"
          className={classes.menuButton}
          color="inherit"
          aria-label="menu"
        >
          <LoginIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default AdminAppBar;
