import React, { useReducer, useEffect } from "react";

import { validate } from "../../util/validators";
import "./Input.css";

const inputReducer = (state, action) => {
  switch (action.type) {
    case "CHANGE":
      return {
        ...state,
        value: action.val,
        isValid: validate(action.val, action.validators),
      };
    case "TOUCH": {
      return {
        ...state,
        isTouched: true,
      };
    }
    default:
      return state;
  }
};

const Input = (props) => {
  const [inputState, dispatch] = useReducer(inputReducer, {
    value: props.initialValue || "",
    isTouched: false,
    isValid: props.initialValid || false,
  });

  const { id, onInput } = props;
  const { value, isValid } = inputState;

  useEffect(() => {
    onInput(id, value, isValid);
  }, [id, value, isValid, onInput]);

  const changeHandler = (event) => {
    dispatch({
      type: "CHANGE",
      val: event.target.value,
      validators: props.validators,
    });
  };

  const touchHandler = () => {
    dispatch({
      type: "TOUCH",
    });
  };

  let element;
  let inputPrint;
  if(props.type === 'number'){
    inputPrint =(
      <input
        id={props.id}
        type={props.type}
        min={0}
        placeholder={props.placeholder}
        onChange={changeHandler}
        onBlur={touchHandler}
        value={inputState.value}
      />
    );
  }else{
    inputPrint =(
      <input
        id={props.id}
        type={props.type}
        placeholder={props.placeholder}
        onChange={changeHandler}
        onBlur={touchHandler}
        value={inputState.value}
      />
    );
  }
  switch (props.element) {
    case "input":
      element = inputPrint;
      break;
    case "textarea":
      element = (
        <textarea
          id={props.id}
          rows={props.rows || 3}
          onChange={changeHandler}
          onBlur={touchHandler}
          value={inputState.value}
        />
      );
      break;
    case "select":
      element = (
        <select value={inputState.value} onChange={changeHandler} id={props.id}>
          <option value="" disabled>
            Choose here
          </option>
          {props.options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.text}
            </option>
          ))}
        </select>
      );
      break;
    default:
      element = null;
      break;
  }
  let setClassName;
  if (props.className) {
    setClassName = props.className;
  } else {
    setClassName = `form-control ${
      !inputState.isValid && inputState.isTouched && "form-control--invalid"
    }`;
  }
  return (
    <div className={setClassName}>
      <label htmlFor={props.id}>{props.label}</label>
      {element}
      {!inputState.isValid && inputState.isTouched && <p>{props.errorText}</p>}
    </div>
  );
};

export default Input;
