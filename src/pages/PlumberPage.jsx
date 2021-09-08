import React from "react";
import { useSelector } from "react-redux";

import {
  createTheme,
  ThemeProvider,
  makeStyles,
} from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";

import AdminAppBar from "../Components/AdminAppBar";
import MeterMap from "../Components/MeterMap";
import MeterList from "../Components/MeterList";

import {
  streetsMapConfig,
  streetsWideMapConfig
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

const PlumberPage = () => {
  const classes = useStyles();

  return (
    <>
      <ThemeProvider theme={theme}>
        <AdminAppBar title="MeterShop Admin" />
        <Container maxWidth="xl" style={{ paddingTop: "5px" }}>
          <Paper style={{paddingLeft: "10px", paddingRight: "10px", paddingBottom: "10px"}}>
            <Grid container spacing={1}>
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
            </Grid>
          </Paper>
        </Container>
      </ThemeProvider>
    </>
  );
};

export default PlumberPage;

