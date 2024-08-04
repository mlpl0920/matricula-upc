/** @format */

import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";

import FirstRow from "../../shared/components/PageRows/FirstRow";
import SecondRow from "../../shared/components/PageRows/SecondRow";
import Table from "../../shared/components/Table/Table";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
// import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useHttpClient } from "../../shared/hooks/http-hook";

const Profesores = () => {
  const [todosActive, setTodosActive] = useState(true);
  const [activosActive, setActivosActive] = useState(false);
  const [noactivossActive, setNoactivosActive] = useState(false);
  const [triggerEffect, setTriggerEffect] = useState(false);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const history = useHistory();

  const [profesores, setProfesores] = useState([]);
  useEffect(() => {
    const fetchProfesores = async () => {
      try {
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + "/profesores/"
        );
        setProfesores(responseData.profesores);
      } catch (error) {}
    };
    fetchProfesores();
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
          process.env.REACT_APP_BACKEND_URL + `/profesores/${id}`,
          "PATCH",
          JSON.stringify({
            // eslint-disable-next-line
            estado: !profesores.find((profesor) => profesor._id == id).estado,
          }),
          {
            "Content-Type": "application/json",
          }
        );
        history.push("/profesor");
        setTriggerEffect((prev) => !prev);
      } catch (error) {}
    };
    updateState();
  };
  let filterList;
  if (todosActive) filterList = profesores;
  if (activosActive)
    filterList = profesores.filter((profesor) => profesor.estado);
  if (noactivossActive)
    filterList = profesores.filter((profesor) => !profesor.estado);
  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      <section className='main-content'>
        {/* {isLoading && (
          <div className="center">
            <LoadingSpinner asOverlay />
          </div>
        )} */}
        <FirstRow
          todosActive={todosActive}
          btn1Active={activosActive}
          btn2Active={noactivossActive}
          onTodos={todosActiveHandler}
          onBtn1={activosActiveHandler}
          onBtn2={noactivossActiveHandler}
          btn1='Activo'
          btn2='Inactivo'
          page='Profesores'
          total={filterList.length}
          style={{ width: "17rem" }}
        />
        <SecondRow title='Profesores' to='/profesor/new' />
        <Table
          isLoading={isLoading}
          page={filterList}
          headerTable={[
            "nro. Documento",
            "Correo",
            "Estado",
            "Operación",
            "Acción",
          ]}
          headerModalKeys={["nombres", "apellidos"]}
          labelsModal={{
            tipoDoc: "Tipo de documento:",
            documento: "Número de Documento",
            nombres: "Nombres:",
            apellidos: "Apellidos",
            email: "Correo:",
            telefono: "Telefono",
            direccion: "Direccion: ",
            estado: "Estado: ",
            linkedin: "Linkedin: ",
          }}
          statusType='A'
          tableKeys={["documento", "email", "estado"]}
          tableType='profesor'
          onChangeStatus={changeStatusHandler}
        />
      </section>
    </>
  );
};

export default Profesores;
