/** @format */

import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";

import FirstRow from "../../shared/components/PageRows/FirstRow";
import SecondRow from "../../shared/components/PageRows/SecondRow";
import Table from "../../shared/components/Table/Table";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
// import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useHttpClient } from "../../shared/hooks/http-hook";

//ESTA PAGINA SOLO LO VA A VER EL ADMINISTRADOR PRINCIPAL
const Administradores = () => {
  const [todosActive, setTodosActive] = useState(true);
  const [activosActive, setActivosActive] = useState(false);
  const [noactivossActive, setNoactivosActive] = useState(false);
  const [triggerEffect, setTriggerEffect] = useState(false);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const history = useHistory();
  const [administradores, setAdministradores] = useState([]);

  useEffect(() => {
    const fetchAdministradores = async () => {
      try {
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + "/admins/"
        );
        setAdministradores(responseData.admins);
      } catch (error) {}
    };
    fetchAdministradores();
  }, [sendRequest, triggerEffect]);

  const todosActiveHandler = () => {
    setTodosActive(true);
    setActivosActive(false);
    setNoactivosActive(false);
  };
  const activosActiveHandler = () => {
    setTodosActive(false);
    setActivosActive(true);
    setNoactivosActive(false);
  };
  const noactivossActiveHandler = () => {
    setTodosActive(false);
    setActivosActive(false);
    setNoactivosActive(true);
  };
  const changeStatusHandler = (id) => {
    const updateState = async () => {
      try {
        await sendRequest(
          process.env.REACT_APP_BACKEND_URL + `/admins/${id}`,
          "PATCH",
          JSON.stringify({
            // eslint-disable-next-line
            estado: !administradores.find((admin) => admin._id == id).estado,
          }),
          {
            "Content-Type": "application/json",
          }
        );
        history.push("/admin");
        setTriggerEffect((prev) => !prev);
      } catch (error) {}
    };
    updateState();
  };
  let filterList;
  if (todosActive)
    filterList = administradores.filter(
      (admin) => admin.permiso !== "principal"
    );
  if (activosActive)
    filterList = administradores.filter(
      (admin) => admin.estado && admin.permiso !== "principal"
    );
  if (noactivossActive)
    filterList = administradores.filter(
      (admin) => !admin.estado && admin.permiso !== "principal"
    );
  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      <section className='main-content'>
        <FirstRow
          todosActive={todosActive}
          btn1Active={activosActive}
          btn2Active={noactivossActive}
          onTodos={todosActiveHandler}
          onBtn1={activosActiveHandler}
          onBtn2={noactivossActiveHandler}
          btn1='Activo'
          btn2='Inactivo'
          page='Administradores'
          total={filterList.length}
          style={{ width: "17rem" }}
        />
        <SecondRow title='Administradores' to='/admin/new' />
        <Table
          isLoading={isLoading}
          page={filterList}
          headerTable={[
            "nro. Documento",
            "Usuario",
            "Correo",
            "Estado",
            "Operación",
            "Acción",
          ]}
          headerModalKeys={["username"]}
          labelsModal={{
            username: "Username: ",
            //password: "Contraseña: ",
            tipoDoc: "Tipo de documento:",
            documento: "Número de Documento",
            nombres: "Nombres:",
            apellidos: "Apellidos",
            email: "Correo:",
            telefono: "Telefono",
            estado: "Estado: ",
            permiso: "Tipo de permiso: ",
          }}
          statusType='A'
          tableKeys={["documento", "username", "email", "estado"]}
          tableType='admin'
          onChangeStatus={changeStatusHandler}
        />
      </section>
    </>
  );
};

export default Administradores;
