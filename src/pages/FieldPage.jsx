import React from "react";

import Paper from "@material-ui/core/Paper";

import FieldAppBar from "../Components/FieldAppBar";
import FieldInfo from "../Components/FieldInfo";
import FieldMap from "../Components/FieldMap";
import FieldBottomNav from "../Components/FieldBottomNav"

import { streetsSmallMapConfig } from "../mapConfigs";

const FieldPage = () => {
  return (
    <>
      <Paper>
        <FieldAppBar title="MeterShop" />
        <FieldInfo />
        <FieldMap {...streetsSmallMapConfig} />
        <FieldBottomNav/>
      </Paper>
    </>
  );
};

export default FieldPage;
