import React from "react";

import { useAuth0 } from "@auth0/auth0-react";

import {
  createTheme,
  ThemeProvider
} from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";

import MainAppBar from "../Components/MainAppBar";

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
      paper: "#e3f2fd",
    },
  },
});

const AdminPage = () => {
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
              <Grid container spacing={1}></Grid>
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
