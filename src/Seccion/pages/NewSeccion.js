import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";

import Button from "../../shared/components/FormElements/Button";
import Input from "../../shared/components/FormElements/Input";
import { useForm } from "../../shared/hooks/form-hook";
import {
  VALIDATOR_MAXLENGTH,
  VALIDATOR_MINLENGTH,
  VALIDATOR_NO_ESPECIAL_CHARACTER,
  VALIDATOR_REQUIRE,
} from "../../shared/util/validators";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useHttpClient } from "../../shared/hooks/http-hook";

import "../../shared/components/FormElements/PlaceForm.css";

const NewSeccion = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const history = useHistory();
  const [cursos, setCursos] = useState();
  const [profesores, setProfesores] = useState();

  //fetch select cursos
  useEffect(() => {
    const fetchCursos = async () => {
      try {
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + "/cursos/"
        );
        setCursos(responseData.cursos.filter((curso) => curso.estado));
      } catch (error) {}
    };
    const fetchProfesores = async () => {
      try {
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + "/profesores/"
        );
        setProfesores(
          responseData.profesores.filter((profesor) => profesor.estado)
        );
      } catch (error) {}
    };
    fetchCursos();
    fetchProfesores();
  }, [sendRequest]);

  const [formState, inputHandler] = useForm(
    {
      codigo: {
        value: "",
        isValid: false,
      },
      modalidad: {
        value: "",
        isValid: false,
      },
      dia: {
        value: "",
        isValid: false,
      },
      hora: {
        value: "",
        isValid: false,
      },

      profesor: {
        value: "",
        isValid: false,
      },
      curso: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  const placeSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      await sendRequest(
        process.env.REACT_APP_BACKEND_URL + "/secciones/",
        "POST",
        JSON.stringify({
          codigo: formState.inputs.codigo.value,
          modalidad: formState.inputs.modalidad.value,
          dia: formState.inputs.dia.value,
          hora: formState.inputs.hora.value,
          profesor: formState.inputs.profesor.value,
          curso: formState.inputs.curso.value,
        }),
        {
          "Content-Type": "application/json",
        }
      );
      history.push("/seccion");
    } catch (error) {}
  };
  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      <section className="main-content form">
        {isLoading && (
          <div className="center">
            <LoadingSpinner asOverlay />
          </div>
        )}
        {!isLoading && cursos && profesores && (
          <form className="place-form" onSubmit={placeSubmitHandler}>
            <Input
              id="codigo"
              element="input"
              type="text"
              label="Codigo"
              validators={[
                VALIDATOR_MINLENGTH(5),
                VALIDATOR_MAXLENGTH(5),
                VALIDATOR_NO_ESPECIAL_CHARACTER(),
              ]}
              errorText="Debe de ser de 5 caracteres no especiales."
              onInput={inputHandler}
            />
            <Input
              id="modalidad"
              element="select"
              options={[
                { value: "presencial", text: "Presencial" },
                { value: "virtual", text: "Virtual" },
              ]}
              label="Modalidad"
              validators={[VALIDATOR_REQUIRE()]}
              errorText="Este campo es requerido"
              onInput={inputHandler}
            />
            <Input
              id="dia"
              element="select"
              options={[
                { value: "lunes", text: "Lunes" },
                { value: "martes", text: "Martes" },
                { value: "miercoles", text: "Miercoles" },
                { value: "jueves", text: "Jueves" },
                { value: "viernes", text: "Viernes" },
                { value: "sabado", text: "Sabado" },
              ]}
              label="Día"
              validators={[VALIDATOR_REQUIRE()]}
              errorText="Este campo es requerido"
              onInput={inputHandler}
            />
            <Input
              id="hora"
              element="select"
              options={[
                { value: "7-9a.m", text: "7-9a.m" },
                { value: "9-11.am", text: "9-11.am" },
                { value: "11-1pm", text: "11-1pm" },
                { value: "1-2pm", text: "1-2pm" },
                { value: "2-4pm", text: "2-4pm" },
                { value: "4-6pm", text: "4-6pm" },
              ]}
              label="Hora"
              validators={[VALIDATOR_REQUIRE()]}
              errorText="Este campo es requerido"
              onInput={inputHandler}
            />

            <Input
              id="profesor"
              element="select"
              // options={[
              //   { value: "p1", text: "Profesor 1" },
              //   { value: "p2", text: "Profesor 2" },
              //   { value: "p3", text: "Profesor 3" },
              // ]}
              options={profesores.map((profesor) => {
                return {
                  value: profesor._id,
                  text: `${profesor.nombres} ${profesor.apellidos}`,
                };
              })}
              label="Profesor"
              validators={[VALIDATOR_REQUIRE()]}
              errorText="Este campo es requerido"
              onInput={inputHandler}
            />
            <Input
              id="curso"
              element="select"
              // options={[
              //   { value: "c1", text: "Curso 1" },
              //   { value: "c2", text: "Curso 2" },
              //   { value: "c3", text: "Curso 3" },
              // ]}
              options={cursos.map((curso) => {
                return { value: curso._id, text: curso.nombre };
              })}
              label="Curso"
              validators={[VALIDATOR_REQUIRE()]}
              errorText="Este campo es requerido"
              onInput={inputHandler}
            />

            <Button type="submit" disabled={!formState.isValid}>
              AÑADIR SECCIÓN
            </Button>
          </form>
        )}
      </section>
    </>
  );
};

export default NewSeccion;
