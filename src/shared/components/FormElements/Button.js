import React from "react";
import { Link } from "react-router-dom";

import classes from "./Button.module.css";

const Button = (props) => {
  let setClassName;
  if (props.className) {
    setClassName = props.className;
  } else {
    setClassName = `${classes.Button} ${props.danger ? classes.Danger : ""} ${
      props.size ? classes[`size--${props.size}`] : ""
    }`;
  }
  let button = (
    <button
      style={{ zoom: props.zoom }}
      className={setClassName}
      type={props.type}
      disabled={props.disabled}
      onClick={props.onClick}
    >
      {props.children}
    </button>
  );
  if (props.to) {
    button = (
      <Link
        style={{ zoom: props.zoom }}
        className={`${classes.Button} button--${props.size || "default"} ${
          props.danger && "button--danger"
        }`}
        to={props.to}
      >
        {props.children}
      </Link>
    );
  }
  return button;
};

export default Button;
