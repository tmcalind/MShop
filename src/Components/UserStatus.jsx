import React, { useEffect } from "react";
import { Avatar, Card, CardHeader, Toolbar } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import { makeStyles } from "@material-ui/core/styles";
import { FiLogIn as LoginIcon, FiLogOut as LogoutIcon } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { useAuth0 } from "@auth0/auth0-react";
import { setAuth, setRoles } from "../slices/userSlice";
import * as Cookies from "js-cookie";

import { AUTH0_DOMAIN } from "../config";

const useStyles = makeStyles((theme) => ({

  menuButton: {
    marginRight: theme.spacing(1),
  },
 
}));

const UserStatus = () => {
  const dispatch = useDispatch();
  const { user, loginWithRedirect, logout, getAccessTokenSilently } =
    useAuth0();

  const auth = useSelector((state) => state.user.auth);
  const classes = useStyles();

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

          const roles = {
            ...user_metadata,
            admin: true,
            field: false,
          };

          dispatch(setRoles(roles));
          dispatch(setAuth(user));

          Cookies.set(
            "MShopAuth",
            JSON.stringify({
              auth: user,
              roles,
            }),
            { expires: 1 }
          );
        }
      } catch (e) {
        console.log(`useEffect getUserMetadata error: `, e.message);
      }
    };

    if (user) {
      getUserMetadata();
    }
  }, [getAccessTokenSilently, user]);

  const userLogin = () => {
    loginWithRedirect();
  };

  const userLogout = () => {
    logout();

    dispatch(setAuth(null));
    dispatch(setRoles(null));
  };

  return (
    <div>
      {auth ? (
        <Card>
          <CardHeader
            style={{ padding: "4px" }}
            avatar={<Avatar>{auth.name.charAt(0).toUpperCase()}</Avatar>}
            action={
              <IconButton
                edge="end"
                className={classes.menuButton}
                color="inherit"
                aria-label="menu"
                onClick={userLogout}
              >
                <LogoutIcon />
              </IconButton>
            }
            title={auth.name}
          />
        </Card>
      ) : (
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
      )}
    </div>
  );
};

export default UserStatus;
