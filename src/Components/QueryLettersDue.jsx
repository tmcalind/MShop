import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { setObjectIdList } from "../slices/featureSlice";

import { queryFeatures } from "@esri/arcgis-rest-feature-layer";

import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Checkbox from "@material-ui/core/Checkbox";
import ListItemIcon from "@material-ui/core/ListItemIcon";

import { WATER_METER_ADDRESSES_FEATURE_SERVER_URL } from "../config";

const useStyles = makeStyles((theme) => ({
  root: {
    width: 500,
    maxWidth: 500,
    backgroundColor: theme.palette.background.paper,
  },
}));

const letterOptions = [
  {
    Id: 0,
    Status: "Marked",
    Days: 15,
  },
  {
    Id: 1,
    Status: "Letter1",
    Days: 15,
  },
  {
    Id: 2,
    Status: "Letter2",
    Days: 15,
  },
  {
    Id: 3,
    Status: "Letter3",
    Days: 15,
  },
  {
    Id: 4,
    Status: "Letter4",
    Days: 15,
  },
  {
    Id: 5,
    Status: "Shutoff",
    Days: 15,
  },
];

const QueryLettersDue = ({ closeWhenComplete }) => {
  const classes = useStyles();

  const dispatch = useDispatch();

  const [checked, setChecked] = useState([]);
  const [statusMarked, setStatusMarked] = useState(-1);
  const [statusLetter1, setStatusLetter1] = useState(250);
  const [statusLetter2, setStatusLetter2] = useState(250);
  const [statusLetter3, setStatusLetter3] = useState(250);
  const [statusLetter4, setStatusLetter4] = useState(250);
  const [statusShutoff, setStatusShutoff] = useState(-1);

  const handleToggle = (letterOption) => () => {
    const currentIndex = checked.indexOf(letterOption);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(letterOption);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

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
    });
  };

  const onSubmitLettersDue = () => {
    const requestedLetters = {
      Marked: 15,
      Letter1: statusLetter1,
      Letter2: statusLetter2,
      Letter3: statusLetter3,
      Letter4: statusLetter4,
      ShutoffNotice: statusShutoff,
    };

    getLettersDue(requestedLetters);

    closeWhenComplete(true);
  };

  const onTextChange = (e) => {
    switch (e.target.id) {
      case "statusMarked":
        setStatusMarked(e.target.value);
        break;
      case "statusLetter1":
        setStatusLetter1(e.target.value);
        break;
      case "statusLetter2":
        setStatusLetter2(e.target.value);
        break;
      case "statusLetter3":
        setStatusLetter3(e.target.value);
        break;
      case "statusLetter4":
        setStatusLetter4(e.target.value);
        break;
      case "statusShutoff":
        setStatusShutoff(e.target.value);
        break;
      default:
        break;
    }

    // console.log(e);
  };

  return (
    <>
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <List className={classes.root}>
            {letterOptions.map((letterOption) => {
              const labelId = `checkbox-list-label-${letterOption.Id}`;
              const textFieldId = `status${letterOption.Status}`;

              return (
                <ListItem
                  key={letterOption.Id}
                  role={undefined}
                  dense
                  button
                  onClick={handleToggle(letterOption)}
                >
                  <ListItemIcon>
                    <Checkbox
                      edge="start"
                      checked={checked.indexOf(letterOption) !== -1}
                      tabIndex={-1}
                      disableRipple
                      inputProps={{ "aria-labelledby": labelId }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    id={labelId}
                    primary={`'${letterOption.Status}' status not changed in:`}
                  />
                  <ListItemSecondaryAction>
                    <TextField
                      id={textFieldId}
                      label="Days"
                      size="small"
                      className={classes.textField}
                      defaultValue={letterOption.Days}
                      onChange={onTextChange}
                      style={{ width: "150px" }}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
              );
            })}
          </List>
        </Grid>
        <Grid item xs={12}>
          <Button onClick={onSubmitLettersDue} color="primary">
            Query Letters Due
          </Button>
        </Grid>
      </Grid>
    </>
  );
};

export default QueryLettersDue;
