import React from "react";

import classes from "./ButtonFilter.module.css";

const ButtonFilter = (props) => {
  return (
    <div className={classes.ButtonFilter} style={props.style}>
      <div
        onClick={props.onTodos}
        className={props.todosActive ? classes.active : ""}
      >
        Todos
      </div>
      <div
        onClick={props.onBtn1}
        className={props.btn1Active ? classes.active : ""}
      >
        {props.btn1}
      </div>
      <div
        onClick={props.onBtn2}
        className={props.btn2Active ? classes.active : ""}
      >
        {props.btn2}
      </div>
    </div>
  );
};

export default ButtonFilter;
