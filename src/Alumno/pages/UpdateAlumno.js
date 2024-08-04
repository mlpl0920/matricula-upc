/** @format */

import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";

import Button from "../../shared/components/FormElements/Button";
import Input from "../../shared/components/FormElements/Input";
import { useForm } from "../../shared/hooks/form-hook";
import {
  VALIDATOR_EMAIL,
  VALIDATOR_MAX,
  VALIDATOR_MAXLENGTH,
  VALIDATOR_MIN,
  VALIDATOR_MINLENGTH,
  VALIDATOR_NO_ESPECIAL_CHARACTER,
  VALIDATOR_NUMBER,
  VALIDATOR_REQUIRE,
} from "../../shared/util/validators";
import "../../shared/components/FormElements/PlaceForm.css";
import Card from "../../shared/components/UIElements/Card";
import { useHttpClient } from "../../shared/hooks/http-hook";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";

const UpdateAlumnos = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedAlumno, setLoadedAlumno] = useState();
  const { alumnoId } = useParams();
  const history = useHistory();

  const [formState, inputHandler, setFormData] = useForm(
    {
      nombres: {
        value: "",
        isValid: false,
      },
      apellidos: {
        value: "",
        isValid: false,
      },
      email: {
        value: "",
        isValid: false,
      },
      tipoDoc: {
        value: "",
        isValid: false,
      },
      documento: {
        value: "",
        isValid: false,
      },
      semestre: {
        value: "",
        isValid: false,
      },
      sexo: {
        value: "",
        isValid: false,
      },
      telefono: {
        value: "",
        isValid: false,
      },
      direccion: {
        value: "",
        isValid: false,
      },
      ciclo: {
        value: "",
        isValid: false,
      },
    },
    false
  );
  useEffect(() => {
    const fetchAlumnos = async () => {
      try {
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + `/alumnos/${alumnoId}`
        );
        setLoadedAlumno(responseData.alumno);
        setFormData(
          {
            nombres: {
              value: responseData.alumno.nombres,
              isValid: true,
            },
            apellidos: {
              value: responseData.alumno.apellidos,
              isValid: true,
            },
            email: {
              value: responseData.alumno.email,
              isValid: true,
            },
            tipoDoc: {
              value: responseData.alumno.tipoDoc,
              isValid: true,
            },
            documento: {
              value: responseData.alumno.documento,
              isValid: true,
            },
            semestre: {
              value: responseData.alumno.semestre,
              isValid: true,
            },
            sexo: {
              value: responseData.alumno.sexo,
              isValid: true,
            },
            telefono: {
              value: responseData.alumno.telefono,
              isValid: true,
            },
            direccion: {
              value: responseData.alumno.direccion,
              isValid: true,
            },
            ciclo: {
              value: responseData.alumno.ciclo,
              isValid: true,
            },
          },
          true
        );
      } catch (err) {}
    };
    fetchAlumnos();
  }, [sendRequest, alumnoId, setFormData]);

  const placeSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      await sendRequest(
        process.env.REACT_APP_BACKEND_URL + `/alumnos/${alumnoId}`,
        "PATCH",
        JSON.stringify({
          nombres: formState.inputs.nombres.value,
          apellidos: formState.inputs.apellidos.value,
          email: formState.inputs.email.value,
          tipoDoc: formState.inputs.tipoDoc.value,
          semestre: formState.inputs.semestre.value,
          documento: formState.inputs.documento.value,
          sexo: formState.inputs.sexo.value,
          telefono: formState.inputs.telefono.value,
          direccion: formState.inputs.direccion.value,
          ciclo: formState.inputs.ciclo.value,
        }),
        {
          "Content-Type": "application/json",
        }
      );
      history.push("/alumno");
    } catch (err) {}
  };
  if (isLoading) {
    return (
      <div className='center'>
        <LoadingSpinner asOverlay />
      </div>
    );
  }

  if (!loadedAlumno && !error) {
    return (
      <div className='center'>
        <Card>
          <h2>No pudimos identificar al alumno!</h2>
        </Card>
      </div>
    );
  }
  return (
    <>
      <ErrorModal error={error} onClear={clearError} />

      <section className='main-content form'>
        {!isLoading && loadedAlumno && (
          <form className='place-form' onSubmit={placeSubmitHandler}>
            <Input
              id='nombres'
              element='input'
              type='text'
              label='Nombres'
              validators={[
                VALIDATOR_MINLENGTH(3),
                VALIDATOR_MAXLENGTH(100),
                VALIDATOR_NO_ESPECIAL_CHARACTER(),
              ]}
              errorText='Entre 3 y 100 caracteres no especiales.'
              onInput={inputHandler}
              initialValue={loadedAlumno.nombres}
              initialValid={true}
            />
            <Input
              id='apellidos'
              element='input'
              label='Apellidos'
              validators={[
                VALIDATOR_MINLENGTH(3),
                VALIDATOR_MAXLENGTH(100),
                VALIDATOR_NO_ESPECIAL_CHARACTER(),
              ]}
              errorText='Entre 3 y 100 caracteres no especiales.'
              onInput={inputHandler}
              initialValue={loadedAlumno.apellidos}
              initialValid={true}
            />
            <Input
              id='email'
              element='input'
              label='Correo'
              validators={[VALIDATOR_EMAIL(), VALIDATOR_MAXLENGTH(30)]}
              errorText='Debe ser un correo gmail con un máximo de 30 caracteres'
              onInput={inputHandler}
              initialValue={loadedAlumno.email}
              initialValid={true}
            />
            <Input
              id='tipoDoc'
              element='select'
              options={[
                { value: "dni", text: "DNI" },
                { value: "pasaporte", text: "Pasaporte" },
                { value: "extranjeria", text: "Carnet de extranjería" },
              ]}
              label='Tipo de Documento'
              validators={[VALIDATOR_REQUIRE()]}
              errorText='Este campo es requerido'
              onInput={inputHandler}
              initialValue={loadedAlumno.tipoDoc}
              initialValid={true}
            />
            <Input
              id='semestre'
              element='select'
              options={[
                { value: "2021-1", text: "2021-1" },
                { value: "2021-2", text: "2021-2" },
                { value: "2022-0", text: "2022-0" },
              ]}
              label='Semestre'
              validators={[VALIDATOR_REQUIRE()]}
              errorText='Este campo es requerido'
              onInput={inputHandler}
              initialValue={loadedAlumno.semestre}
              initialValid={true}
            />
            <Input
              id='documento'
              element='input'
              type='text'
              label='Número de documento'
              validators={[
                VALIDATOR_MINLENGTH(8),
                VALIDATOR_MAXLENGTH(12),
                VALIDATOR_NUMBER(),
              ]}
              errorText='Entre 8 y 12 caracteres no especiales.'
              onInput={inputHandler}
              initialValue={loadedAlumno.documento}
              initialValid={true}
            />
            <Input
              id='sexo'
              element='select'
              options={[
                { value: "M", text: "M" },
                { value: "F", text: "F" },
              ]}
              label='Sexo'
              validators={[VALIDATOR_REQUIRE()]}
              errorText='Este campo es requerido'
              onInput={inputHandler}
              initialValue={loadedAlumno.sexo}
              initialValid={true}
            />
            <Input
              id='telefono'
              element='input'
              type='text'
              label='Teléfono'
              validators={[
                VALIDATOR_NUMBER(),
                VALIDATOR_MINLENGTH(9),
                VALIDATOR_MAXLENGTH(13),
              ]}
              errorText='Entre 9 y 13 digitos.'
              onInput={inputHandler}
              initialValue={loadedAlumno.telefono}
              initialValid={true}
            />
            <Input
              id='direccion'
              element='input'
              type='text'
              label='Dirección'
              validators={[VALIDATOR_REQUIRE(), VALIDATOR_MAXLENGTH(100)]}
              errorText='Entre 1 y 100 caracteres.'
              onInput={inputHandler}
              initialValue={loadedAlumno.direccion}
              initialValid={true}
            />

            {!loadedAlumno.estado && (
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
                initialValue={loadedAlumno.ciclo}
                initialValid={true}
              />
            )}

            <Button type='submit' disabled={!formState.isValid}>
              ACTUALIZAR ALUMNO
            </Button>
          </form>
        )}
      </section>
    </>
  );
};

export default UpdateAlumnos;
