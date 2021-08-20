import React from 'react';
import { useSelector } from "react-redux";

import { createTheme, ThemeProvider, makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import AdminPage from './pages/AdminPage'
import FieldPage from './pages/FieldPage'
import LandingPage from './pages/LandingPage'

const theme = createTheme({
  typography: {
    fontSize: 14
  },
  palette: {
    primary: {
      light: '#819ca9',
      main: '#546e7a',
      dark: '#29434e',
      contrastText: '#ffffff',
    },
    secondary: {
      light: '#62727b',
      main: '#37474f',
      dark: '#102027',
      contrastText: '#ffffff',
    },
    background: {
      paper: '#cfd8dc'
    }
  }
});

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    width: '100%',
    height: '100%'
  },
}));

function App() {
  const auth = useSelector((state) => state.user.auth);
  const roles = useSelector((state) => state.user.roles);

  const classes = useStyles();

  return (
    <>
    <ThemeProvider theme={theme}>
        <div className={classes.root}>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              {auth ? (
              <>
                {roles.admin ? <AdminPage /> 
                          : <FieldPage />}
              </>
              ) : (<LandingPage />) }            
            </Grid>
          </Grid>         
        </div>
      </ThemeProvider>
    </>
  );
}

export default App;