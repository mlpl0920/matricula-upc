import React from "react";
import ButtonFilter from "../UIElements/ButtonFilter";

import classes from "./FirstRow.module.css";
const FirstRow = (props) => {
  return (
    <div className={classes.FirstRow}>
      <ButtonFilter
        style={props.style}
        todosActive={props.todosActive}
        btn1Active={props.btn1Active}
        btn2Active={props.btn2Active}
        onTodos={props.onTodos}
        onBtn1={props.onBtn1}
        onBtn2={props.onBtn2}
        btn1={props.btn1}
        btn2={props.btn2}
      />
      <div>
        <p>
          Total de {props.page}: <span>{props.total}</span>
        </p>
      </div>
    </div>
  );
};

export default FirstRow;
