import React from "react";
import { useSelector } from "react-redux";
import { useAuth0 } from "@auth0/auth0-react";

import {
  createTheme,
  ThemeProvider,
  makeStyles,
} from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";

import MainAppBar from "../Components/MainAppBar";
import MeterMap from "../Components/MeterMap";
import MeterList from "../Components/MeterList";

import {
  streetsMapConfig,
  streetsWideMapConfig,
  basemapLondonMapConfig,
} from "../mapConfigs";
import MeterInfo from "../Components/MeterInfo";

const theme = createTheme({
  typography: {
    fontSize: 14,
  },
  palette: {
    primary: {
      light: "#819ca9",
      main: "#546e7a",
      dark: "#29434e",
      contrastText: "#ffffff",
    },
    secondary: {
      light: "#62727b",
      main: "#37474f",
      dark: "#102027",
      contrastText: "#ffffff",
    },
    background: {
      paper: "#cfd8dc",
    },
  },
});

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    backgroundColor: theme.palette.background.paper,
  },
  card: {
    flexGrow: 1,
  },
}));

const AdminPage = () => {
  const classes = useStyles();

  const objectIdList = useSelector((state) => state.feature.objectIdList);

  const { isAuthenticated, isLoading, error } = useAuth0();

  return (
    <>
      {isLoading && <h1>Loading</h1>}
      {error && <h1>Oops... Something went wrong</h1>}
      <ThemeProvider theme={theme}>
        <MainAppBar title="MeterShop Admin" />
        <Container maxWidth="xl" style={{ paddingTop: "5px" }}>
          <Paper>
            {isAuthenticated ? (
              <Grid container spacing={1}>
                {objectIdList && objectIdList.length > 0 ? (
                  <>
                    <Grid item xs={5}>
                      <Card
                        className={classes.card}
                        variant="outlined"
                        style={{ paddingLeft: "10px" }}
                      >
                        <MeterList />
                      </Card>
                    </Grid>
                    <Grid item xs={7}>
                      <Card className={classes.card} variant="outlined">
                        <MeterInfo />
                        <Card
                          className={classes.card}
                          variant="outlined"
                          style={{ padding: "5px" }}
                        >
                          {" "}
                          <MeterMap {...streetsMapConfig} />{" "}
                        </Card>
                      </Card>
                    </Grid>
                  </>
                ) : (
                  <>
                    <Grid item xs={12}>
                      <Card
                        className={classes.card}
                        variant="outlined"
                        style={{ paddingLeft: "10px" }}
                      >
                        <MeterInfo />
                        <MeterMap {...streetsWideMapConfig} />
                      </Card>
                    </Grid>
                  </>
                )}
              </Grid>
            ) : (
              <>
                <h1>You are not logged in</h1>
              </>
            )}
          </Paper>
        </Container>
      </ThemeProvider>
    </>
  );
};

export default AdminPage;
