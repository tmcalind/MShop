import React from "react";

import MainAppBar from "../Components/MainAppBar";

const LandingPage = ({ message }) => {
  return (
    <>
      <MainAppBar title="MeterShop Home" />
      <h4>{message}</h4>
    </>
  );
};

export default LandingPage;
