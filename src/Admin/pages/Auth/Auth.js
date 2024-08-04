import React, { useContext } from "react";
import { useForm } from "../../../shared/hooks/form-hook";

import TopNavigation from "../../../shared/components/Navigation/TopNavigation";
import Button from "../../../shared/components/FormElements/Button";
import Input from "../../../shared/components/FormElements/Input";
import { AuthContext } from "../../../shared/context/auth-context";
import ErrorModal from "../../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../../shared/components/UIElements/LoadingSpinner";
import { useHttpClient } from "../../../shared/hooks/http-hook";

import classes from "./Auth.module.css";

const Auth = () => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const [formState, inputHandler] = useForm(
    {
      username: {
        value: "",
        isValid: true,
      },
      password: {
        value: "",
        isValid: true,
      },
    },
    true
  );

  const placeSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      console.log(process.env.REACT_APP_BACKEND_URL + "/admins/login");
      const responseData = await sendRequest(
        process.env.REACT_APP_BACKEND_URL + "/admins/login",
        "POST",
        JSON.stringify({
          username: formState.inputs.username.value,
          password: formState.inputs.password.value,
        }),
        {
          "Content-Type": "application/json",
        }
      );
      auth.login(responseData.admin, responseData.token);
    } catch (error) {}
  };
  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && <LoadingSpinner asOverlay />}
      <TopNavigation
        className={classes.TopNavigation}
        customRightItem={
          <div className={classes.Recuperar}>
            {/* <p>Olvidaste tu contraseña?</p>
            <a href="/">Recuperar</a> */}
          </div>
        }
        hideRightItem
      />
      <section className={classes.Auth}>
        <form onSubmit={placeSubmitHandler}>
          <h2>Bienvenido otra vez!</h2>

          <Input
            className={classes.Input}
            id="username"
            element="input"
            type="text"
            label="Usuario"
            onInput={inputHandler}
            validators={[]}
          />
          <Input
            className={classes.Input}
            id="password"
            element="input"
            type="password"
            label="Contraseña"
            onInput={inputHandler}
            validators={[]}
          />

          <Button className="custom" type="submit">
            Entrar a Matricula Online
          </Button>
        </form>
      </section>
    </>
  );
};

export default Auth;
