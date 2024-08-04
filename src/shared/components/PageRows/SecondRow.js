import React from "react";
import Button from "../FormElements/Button";

import classes from "./SecondRow.module.css";

const SecondRow = (props) => {
  return (
    <div className={classes.SecondRow}>
      <h3>{props.title}</h3>
      <Button to={props.to}>Añadir nuevo</Button>
    </div>
  );
};

export default SecondRow;
