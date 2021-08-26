import React, { useState } from "react";

import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";

import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

import QueryByAttributes from "./QueryByAttributes";
import QueryLettersDue from "./QueryLettersDue";
import QueryByStatus from "./QueryByStatus";

const QueryDialog = ({ onClose, open }) => {
  const [expanded, setExpanded] = useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <Dialog open={open} onClose={() => onClose()}>
      <DialogTitle>Queries</DialogTitle>
      <Accordion
        expanded={expanded === "panel1"}
        onChange={handleChange("panel1")}
      >
        <AccordionSummary 
          expandIcon={<ExpandMoreIcon/>}
        >
          Letters Due
        </AccordionSummary>
        <AccordionDetails>
          <QueryLettersDue closeWhenComplete={() => onClose()} />
        </AccordionDetails>
      </Accordion>
      <Accordion
        expanded={expanded === "panel2"}
        onChange={handleChange("panel2")}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon/>}
        >
          By Attributes
        </AccordionSummary>
        <AccordionDetails>
          <QueryByAttributes closeWhenComplete={() => onClose()} />
        </AccordionDetails>
      </Accordion>
      <Accordion
        expanded={expanded === "panel3"}
        onChange={handleChange("panel3")}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon/>}
        >
          By Status</AccordionSummary>
        <AccordionDetails>
          <QueryByStatus closeWhenComplete={() => onClose()} />
        </AccordionDetails>
      </Accordion>
    </Dialog>
  );
};

export default QueryDialog;
