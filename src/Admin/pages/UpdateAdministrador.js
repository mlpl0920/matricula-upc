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
  VALIDATOR_PASSWORD,
  VALIDATOR_PASSWORD_EDIT,
  VALIDATOR_REQUIRE,
} from "../../shared/util/validators";
import "../../shared/components/FormElements/PlaceForm.css";
import Card from "../../shared/components/UIElements/Card";
import { useHttpClient } from "../../shared/hooks/http-hook";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";

const UpdateAdministrador = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedAdmin, setLoadedAdmin] = useState();

  const { adminId } = useParams();
  const history = useHistory();
  const [formState, inputHandler, setFormData] = useForm(
    {
      username: {
        value: "",
        isValid: false,
      },
      password: {
        value: "",
        isValid: false,
      },
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
    },
    false
  );
  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + `/admins/${adminId}`
        );
        setLoadedAdmin(responseData.admin);
        setFormData(
          {
            username: {
              value: responseData.admin.username,
              isValid: true,
            },
            password: {
              value: responseData.admin.password,
              isValid: true,
            },
            tipoDoc: {
              value: responseData.admin.tipoDoc,
              isValid: true,
            },
            documento: {
              value: responseData.admin.documento,
              isValid: true,
            },
            nombres: {
              value: responseData.admin.nombres,
              isValid: true,
            },
            apellidos: {
              value: responseData.admin.apellidos,
              isValid: true,
            },
            telefono: {
              value: responseData.admin.telefono,
              isValid: true,
            },
            email: {
              value: responseData.admin.email,
              isValid: true,
            },
          },
          true
        );
      } catch (err) {}
    };
    fetchAdmins();
  }, [sendRequest, adminId, setFormData]);

  const placeSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      await sendRequest(
        process.env.REACT_APP_BACKEND_URL + `/admins/${adminId}`,
        "PATCH",
        JSON.stringify({
          username: formState.inputs.username.value,
          password: formState.inputs.password.value,
          tipoDoc: formState.inputs.tipoDoc.value,
          documento: formState.inputs.documento.value,
          nombres: formState.inputs.nombres.value,
          apellidos: formState.inputs.apellidos.value,
          telefono: formState.inputs.telefono.value,
          email: formState.inputs.email.value,
        }),
        {
          "Content-Type": "application/json",
        }
      );
      history.push("/admin");
    } catch (err) {}
  };
  if (isLoading) {
    return (
      <div className='center'>
        <LoadingSpinner asOverlay />
      </div>
    );
  }

  if (!loadedAdmin && !error) {
    return (
      <div className='center'>
        <Card>
          <h2>No pudimos identificar al administrador!</h2>
        </Card>
      </div>
    );
  }
  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      <section className='main-content form'>
        {!isLoading && loadedAdmin && (
          <form className='place-form' onSubmit={placeSubmitHandler}>
            <Input
              id='username'
              element='input'
              type='text'
              label='Username'
              validators={[
                VALIDATOR_MINLENGTH(5),
                VALIDATOR_MAXLENGTH(9),
                VALIDATOR_NO_ESPECIAL_CHARACTER(),
              ]}
              errorText='Entre 5 a 9 caracteres no especiales.'
              onInput={inputHandler}
              initialValue={loadedAdmin.username}
              initialValid={true}
            />
            <Input
              id='password'
              element='input'
              type='password'
              label='Contraseña'
              validators={[VALIDATOR_PASSWORD_EDIT()]}
              errorText='Entre 8 y 16 caracteres, al menos 1 digito, minuscula y mayúscula.'
              onInput={inputHandler}
              initialValue={""}
              initialValid={true}
            />
            <p>*Deje el campo contraseña vacía si no desea editarla</p>
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
              initialValue={loadedAdmin.nombres}
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
              initialValue={loadedAdmin.apellidos}
              initialValid={true}
            />
            <Input
              id='email'
              element='input'
              label='Correo'
              validators={[VALIDATOR_EMAIL(), VALIDATOR_MAXLENGTH(30)]}
              errorText='Debe ser un correo gmail con un máximo de 30 caracteres'
              onInput={inputHandler}
              initialValue={loadedAdmin.email}
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
              initialValue={loadedAdmin.tipoDoc}
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
              initialValue={loadedAdmin.documento}
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
              initialValue={loadedAdmin.telefono}
              initialValid={true}
            />

            <Button type='submit' disabled={!formState.isValid}>
              ACTUALIZAR ADMINISTRADOR
            </Button>
          </form>
        )}
      </section>
    </>
  );
};

export default UpdateAdministrador;
