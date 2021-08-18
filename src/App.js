import React from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";

import LandingPage from './pages/LandingPage'
import AdminPage from './pages/AdminPage'
import FieldPage from './pages/FieldPage'

function App() {

   return (
    <>
    {/* <AdminPage /> */}
      <Router>
          <Route exact path="/" component={LandingPage} />
          <Route path="/admin" component={AdminPage} />
          <Route path="/field" component={FieldPage} />
          
      </Router> 
    </>
  );
}

export default App;
