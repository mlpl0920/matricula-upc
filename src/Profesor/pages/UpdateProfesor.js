/** @format */

import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";

import Button from "../../shared/components/FormElements/Button";
import Input from "../../shared/components/FormElements/Input";
import { useForm } from "../../shared/hooks/form-hook";
import {
  VALIDATOR_EMAIL,
  VALIDATOR_MAXLENGTH,
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

const UpdateProfesor = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedProfesor, setLoadedProfesor] = useState();

  const { profesorId } = useParams();
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
      telefono: {
        value: "",
        isValid: false,
      },
      direccion: {
        value: "",
        isValid: false,
      },
      linkedin: {
        value: "",
        isValid: true,
      },
    },
    false
  );
  useEffect(() => {
    const fetchProfesores = async () => {
      try {
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + `/profesores/${profesorId}`
        );
        setLoadedProfesor(responseData.profesor);
        setFormData(
          {
            nombres: {
              value: responseData.profesor.nombres,
              isValid: true,
            },
            apellidos: {
              value: responseData.profesor.apellidos,
              isValid: true,
            },
            email: {
              value: responseData.profesor.email,
              isValid: true,
            },
            tipoDoc: {
              value: responseData.profesor.tipoDoc,
              isValid: true,
            },
            documento: {
              value: responseData.profesor.documento,
              isValid: true,
            },
            telefono: {
              value: responseData.profesor.telefono,
              isValid: true,
            },
            direccion: {
              value: responseData.profesor.direccion,
              isValid: true,
            },
            linkedin: {
              value: responseData.profesor.linkedin,
              isValid: true,
            },
          },
          true
        );
      } catch (err) {}
    };
    fetchProfesores();
  }, [sendRequest, profesorId, setFormData]);
  const placeSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      await sendRequest(
        process.env.REACT_APP_BACKEND_URL + `/profesores/${profesorId}`,
        "PATCH",
        JSON.stringify({
          nombres: formState.inputs.nombres.value,
          apellidos: formState.inputs.apellidos.value,
          email: formState.inputs.email.value,
          tipoDoc: formState.inputs.tipoDoc.value,
          documento: formState.inputs.documento.value,
          telefono: formState.inputs.telefono.value,
          direccion: formState.inputs.direccion.value,
          linkedin: formState.inputs.linkedin.value,
        }),
        {
          "Content-Type": "application/json",
        }
      );
      history.push("/profesor");
    } catch (err) {}
  };
  if (isLoading) {
    return (
      <div className='center'>
        <LoadingSpinner asOverlay />
      </div>
    );
  }

  if (!loadedProfesor && !error) {
    return (
      <div className='center'>
        <Card>
          <h2>No pudimos identificar al profesor!</h2>
        </Card>
      </div>
    );
  }
  return (
    <>
      <ErrorModal error={error} onClear={clearError} />

      <section className='main-content form'>
        {!isLoading && loadedProfesor && (
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
              initialValue={loadedProfesor.nombres}
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
              initialValue={loadedProfesor.apellidos}
              initialValid={true}
            />
            <Input
              id='email'
              element='input'
              label='Correo'
              validators={[VALIDATOR_EMAIL(), VALIDATOR_MAXLENGTH(30)]}
              errorText='Debe ser un correo gmail con un máximo de 30 caracteres'
              onInput={inputHandler}
              initialValue={loadedProfesor.email}
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
              initialValue={loadedProfesor.tipoDoc}
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
              initialValue={loadedProfesor.documento}
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
              initialValue={loadedProfesor.telefono}
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
              initialValue={loadedProfesor.direccion}
              initialValid={true}
            />

            <Input
              id='linkedin'
              element='input'
              type='text'
              label='Linkedin'
              validators={[]}
              errorText='Solo números del 1 al 14.'
              onInput={inputHandler}
              initialValue={loadedProfesor.linkedin}
              initialValid
            />

            <Button type='submit' disabled={!formState.isValid}>
              ACTUALIZAR PROFESOR
            </Button>
          </form>
        )}
      </section>
    </>
  );
};

export default UpdateProfesor;
