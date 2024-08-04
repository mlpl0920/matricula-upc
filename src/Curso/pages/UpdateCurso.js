/** @format */

import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";

import Button from "../../shared/components/FormElements/Button";
import Input from "../../shared/components/FormElements/Input";
import { useForm } from "../../shared/hooks/form-hook";
import {
  VALIDATOR_MIN,
  VALIDATOR_MAX,
  VALIDATOR_MAXLENGTH,
  VALIDATOR_MINLENGTH,
  VALIDATOR_NO_ESPECIAL_CHARACTER,
  VALIDATOR_NUMBER,
} from "../../shared/util/validators";
import "../../shared/components/FormElements/PlaceForm.css";
import Card from "../../shared/components/UIElements/Card";
import { useHttpClient } from "../../shared/hooks/http-hook";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";

const UpdateProfesor = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedCurso, setLoadedCurso] = useState();

  const { cursoId } = useParams();
  const history = useHistory();
  const [formState, inputHandler, setFormData] = useForm(
    {
      codigo: {
        value: "",
        isValid: false,
      },
      ciclo: {
        value: "",
        isValid: false,
      },
      nombre: {
        value: "",
        isValid: false,
      },
      creditos: {
        value: "",
        isValid: false,
      },
    },
    false
  );
  //const identifiedCurso = DUMMY_CURSOS.find((curso) => cursoId === curso._id);
  useEffect(() => {
    const fetchCursos = async () => {
      try {
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + `/cursos/${cursoId}`
        );
        setLoadedCurso(responseData.curso);
        setFormData(
          {
            codigo: {
              value: responseData.curso.codigo,
              isValid: true,
            },
            ciclo: {
              value: responseData.curso.ciclo,
              isValid: true,
            },
            nombre: {
              value: responseData.curso.nombre,
              isValid: true,
            },
            creditos: {
              value: responseData.curso.creditos,
              isValid: true,
            },
          },
          true
        );
      } catch (err) {}
    };
    fetchCursos();
  }, [sendRequest, cursoId, setFormData]);

  const placeSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      await sendRequest(
        process.env.REACT_APP_BACKEND_URL + `/cursos/${cursoId}`,
        "PATCH",
        JSON.stringify({
          codigo: formState.inputs.codigo.value,
          ciclo: formState.inputs.ciclo.value,
          nombre: formState.inputs.nombre.value,
          creditos: formState.inputs.creditos.value,
        }),
        {
          "Content-Type": "application/json",
        }
      );
      history.push("/curso");
    } catch (err) {}
  };

  if (isLoading) {
    return (
      <div style={{ position: "relative" }} className='center'>
        <LoadingSpinner asOverlay />
      </div>
    );
  }

  if (!loadedCurso && !error) {
    return (
      <div className='center'>
        <Card>
          <h2>No pudimos identificar el curso!</h2>
        </Card>
      </div>
    );
  }

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      <section className='main-content form'>
        {!isLoading && loadedCurso && (
          <form className='place-form' onSubmit={placeSubmitHandler}>
            <Input
              id='codigo'
              element='input'
              type='text'
              label='Codigo'
              validators={[
                VALIDATOR_MINLENGTH(5),
                VALIDATOR_MAXLENGTH(5),
                VALIDATOR_NO_ESPECIAL_CHARACTER(),
              ]}
              errorText='Debe de ser de 5 caracteres no especiales.'
              onInput={inputHandler}
              initialValue={loadedCurso.codigo}
              initialValid={true}
            />
            <Input
              id='ciclo'
              element='input'
              type='number'
              label='Ciclo Académico'
              validators={[
                VALIDATOR_NUMBER(),
                VALIDATOR_MIN(1),
                VALIDATOR_MAX(14),
              ]}
              errorText='Solo números del 1 al 14.'
              onInput={inputHandler}
              initialValue={loadedCurso.ciclo}
              initialValid={true}
            />

            <Input
              id='nombre'
              element='input'
              label='Nombre'
              validators={[VALIDATOR_MINLENGTH(5), VALIDATOR_MAXLENGTH(100)]}
              errorText='Tiene que tener 5 a 100 caracteres'
              onInput={inputHandler}
              initialValue={loadedCurso.nombre}
              initialValid={true}
            />
            <Input
              id='creditos'
              element='input'
              type='number'
              label='Creditos'
              validators={[
                VALIDATOR_NUMBER(),
                VALIDATOR_MIN(3),
                VALIDATOR_MAX(6),
              ]}
              errorText='Solo números del 3 al 6'
              onInput={inputHandler}
              initialValue={loadedCurso.creditos}
              initialValid={true}
            />

            <Button type='submit' disabled={!formState.isValid}>
              ACTUALIZAR CURSO
            </Button>
          </form>
        )}
      </section>
    </>
  );
};

export default UpdateProfesor;
