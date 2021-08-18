import React from "react";
import { useDispatch } from "react-redux";
import {
  setObjectIdList,
  setObjectIdListSelected,
} from "../slices/featureSlice";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Badge from "@material-ui/core/Badge";
import { ImMeter as MeterIcon } from "react-icons/im";
import { RiMailSendLine as SendLettersIcon } from "react-icons/ri";
import { FcCancel as OnHoldIcon } from "react-icons/fc";

import { queryFeatures } from "@esri/arcgis-rest-feature-layer";
import { WATER_METER_ADDRESSES_FEATURE_SERVER_URL } from "../config";

const MeterStatusbar = () => {
  const dispatch = useDispatch();

  const getLettersDue = (letterPref) => {
    let whereClause = "";

    if (letterPref.Marked > 0) {
      whereClause +=
        "(Status = 'Marked' and StatusDate <= CURRENT_DATE - INTERVAL '" +
        letterPref.Marked +
        "' DAY)";
    }

    if (letterPref.Letter1 > 0) {
      if (whereClause.length > 0) {
        whereClause += " or ";
      }
      whereClause +=
        "(Status = 'Letter1' and StatusDate <= CURRENT_DATE - INTERVAL '" +
        letterPref.Letter1 +
        "' DAY)";
    }

    if (letterPref.Letter2 > 0) {
      if (whereClause.length > 0) {
        whereClause += " or ";
      }
      whereClause +=
        "(Status = 'Letter2' and StatusDate <= CURRENT_DATE - INTERVAL '" +
        letterPref.Letter2 +
        "' DAY)";
    }

    if (letterPref.Letter3 > 0) {
      if (whereClause.length > 0) {
        whereClause += " or ";
      }
      whereClause +=
        "(Status = 'Letter3' and StatusDate <= CURRENT_DATE - INTERVAL '" +
        letterPref.Letter3 +
        "' DAY)";
    }

    if (letterPref.Letter4 > 0) {
      if (whereClause.length > 0) {
        whereClause += " or ";
      }
      whereClause +=
        "(Status = 'Letter4' and StatusDate <= CURRENT_DATE - INTERVAL '" +
        letterPref.Letter4 +
        "' DAY)";
    }

    if (letterPref.ShutoffNotice > 0) {
      if (whereClause.length > 0) {
        whereClause += " or ";
      }
      whereClause +=
        "(Status = 'ShutoffNotice' and StatusDate <= CURRENT_DATE - INTERVAL '" +
        letterPref.ShutoffNotice +
        "' DAY)";
    }

    queryFeatures({
      url: WATER_METER_ADDRESSES_FEATURE_SERVER_URL,
      where: whereClause,
    }).then((response) => {
      const objectIds = response.features.map(
        (item) => item.attributes.OBJECTID
      );
      dispatch(setObjectIdList(objectIds));

      dispatch(setObjectIdListSelected([]));
    });
  };

  const lettersDueHandler = () => {
    const maxDays = 270;

    const requestedLetters = {
      Marked: maxDays,
      Letter1: maxDays,
      Letter2: maxDays,
      Letter3: maxDays,
      Letter4: maxDays,
      ShutoffNotice: maxDays,
    };

    getLettersDue(requestedLetters);
  };

  const markedQueryHandler = (e) => {
    console.log(e);

    queryFeatures({
      url: WATER_METER_ADDRESSES_FEATURE_SERVER_URL,
      where: "Status = 'Marked'",
    }).then((response) => {
      const objIds = response.features.map((item) => item.attributes.OBJECTID);
      dispatch(setObjectIdList(objIds));

      dispatch(setObjectIdListSelected([]));
    });
  };
  
  return (
    <Toolbar>
      <IconButton>
        <Badge badgeContent={2} color="secondary">
          <MeterIcon color="#884DFF" />
        </Badge>
      </IconButton>
      <IconButton>
        <Badge badgeContent={33} color="secondary">
          <MeterIcon color="#AB274F" />
        </Badge>
      </IconButton>
      <IconButton onClick={markedQueryHandler}>
        <Badge badgeContent={90} color="secondary">
          <MeterIcon color="#1966FF" />
        </Badge>
      </IconButton>
      <IconButton onClick={lettersDueHandler}>
        <Badge badgeContent={86} color="secondary">
          <SendLettersIcon color="#E67300" />
        </Badge>
      </IconButton>
      <IconButton>
        <Badge badgeContent={2} color="secondary">
          <SendLettersIcon color="#CC0000" />
        </Badge>
      </IconButton>

      <IconButton>
        <Badge badgeContent={8} color="secondary">
          <OnHoldIcon />
        </Badge>
      </IconButton>
    </Toolbar>
  );
};

export default MeterStatusbar;
