import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";

import Button from "../../shared/components/FormElements/Button";
import Input from "../../shared/components/FormElements/Input";
import { useForm } from "../../shared/hooks/form-hook";
import {
  VALIDATOR_MAXLENGTH,
  VALIDATOR_MINLENGTH,
  VALIDATOR_NO_ESPECIAL_CHARACTER,
  VALIDATOR_REQUIRE,
} from "../../shared/util/validators";

import Card from "../../shared/components/UIElements/Card";
import "../../shared/components/FormElements/PlaceForm.css";
import { useHttpClient } from "../../shared/hooks/http-hook";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";

const UpdateSeccion = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [cursos, setCursos] = useState();
  const [profesores, setProfesores] = useState();
  const [loadedSeccion, setLoadedSeccion] = useState();
  const { seccionId } = useParams();
  const history = useHistory();
  const [formState, inputHandler, setFormData] = useForm(
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

  useEffect(() => {
    const fetchSecciones = async () => {
      try {
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + `/secciones/${seccionId}`
        );
        setLoadedSeccion(responseData.seccion);
        setFormData(
          {
            codigo: {
              value: responseData.seccion.codigo,
              isValid: true,
            },
            modalidad: {
              value: responseData.seccion.modalidad,
              isValid: true,
            },
            dia: {
              value: responseData.seccion.dia,
              isValid: true,
            },
            hora: {
              value: responseData.seccion.hora,
              isValid: true,
            },
            profesor: {
              value: `${responseData.seccion.profesor.nombres} ${responseData.seccion.profesor.apellidos}`,
              isValid: true,
            },
            curso: {
              value: responseData.seccion.curso.nombre,
              isValid: true,
            },
          },
          true
        );
      } catch (err) {}
    };
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
    (async function(){
      await fetchSecciones();
      await fetchCursos();
      await fetchProfesores();
    })();

    
  }, [sendRequest, seccionId, setFormData]);

  const placeSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      await sendRequest(
        process.env.REACT_APP_BACKEND_URL + `/secciones/${seccionId}`,
        "PATCH",
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
    } catch (err) {}
  };

  if (isLoading) {
    return (
      <div style={{ position: "relative" }} className="center">
        <LoadingSpinner asOverlay />
      </div>
    );
  }

  if (!loadedSeccion && !error) {
    return (
      <div className="center">
        <Card>
          <h2>No pudimos identificar la sección!</h2>
        </Card>
      </div>
    );
  }
  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      <section className="main-content form">
        {!isLoading && loadedSeccion && (
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
              initialValue={loadedSeccion.codigo}
              initialValid={true}
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
              initialValue={loadedSeccion.modalidad}
              initialValid={true}
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
              initialValue={loadedSeccion.dia}
              initialValid={true}
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
              initialValue={loadedSeccion.hora}
              initialValid={true}
            />

            {profesores && <Input
              id="profesor"
              element="select"
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
              initialValue={loadedSeccion.profesor._id}
              initialValid={true}
            />}
            {cursos && <Input
              id="curso"
              element="select"
              options={cursos.map((curso) => {
                return { value: curso._id, text: curso.nombre };
              })}
              label="Curso"
              validators={[VALIDATOR_REQUIRE()]}
              errorText="Este campo es requerido"
              onInput={inputHandler}
              initialValue={loadedSeccion.curso._id}
              initialValid={true}
            />}

            <Button type="submit" disabled={!formState.isValid}>
              ACTUALIZAR SECCIÓN
            </Button>
          </form>
        )}
      </section>
    </>
  );
};

export default UpdateSeccion;
