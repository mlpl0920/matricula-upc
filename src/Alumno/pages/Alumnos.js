/** @format */

import React, { useState, useEffect } from "react";

import FirstRow from "../../shared/components/PageRows/FirstRow";
import SecondRow from "../../shared/components/PageRows/SecondRow";
// import AlumnoTable from "../components/AlumnoTable";
import Table from "../../shared/components/Table/Table";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
// import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useHttpClient } from "../../shared/hooks/http-hook";

// import classes from "./Alumnos.module.css";

const Alumnos = () => {
  const [todosActive, setTodosActive] = useState(true);
  const [matriculadosActive, setMatriculadosActive] = useState(false);
  const [noMatriculadossActive, setNoMatriculadosActive] = useState(false);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const [alumnos, setAlumnos] = useState([]);

  useEffect(() => {
    const fetchAlumnos = async () => {
      try {
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + "/alumnos/"
        );
        setAlumnos(responseData.alumnos);
      } catch (error) {}
    };
    fetchAlumnos();
  }, [sendRequest]);

  const todosActiveHandler = () => {
    setTodosActive(true);
    setMatriculadosActive(false);
    setNoMatriculadosActive(false);
  };
  const matriculadosActiveHandler = () => {
    setTodosActive(false);
    setMatriculadosActive(true);
    setNoMatriculadosActive(false);
  };
  const noMatriculadossActiveHandler = () => {
    setTodosActive(false);
    setMatriculadosActive(false);
    setNoMatriculadosActive(true);
  };
  let filterList;
  if (todosActive) filterList = alumnos;
  if (matriculadosActive)
    filterList = alumnos.filter((alumno) => alumno.estado);
  if (noMatriculadossActive)
    filterList = alumnos.filter((alumno) => !alumno.estado);
  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      <section className='main-content'>
        <FirstRow
          todosActive={todosActive}
          btn1Active={matriculadosActive}
          btn2Active={noMatriculadossActive}
          onTodos={todosActiveHandler}
          onBtn1={matriculadosActiveHandler}
          onBtn2={noMatriculadossActiveHandler}
          btn1='Matriculados'
          btn2='No Matriculados'
          page='Alumnos'
          total={filterList.length}
        />
        <SecondRow title='Alumnos' to='/alumno/new' />

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
            semestre: "Semestre",
            nombres: "Nombres:",
            apellidos: "Apellidos",
            sexo: "Sexo:",
            email: "Correo:",
            telefono: "Telefono",
            direccion: "Direccion: ",
            ciclo: "Ciclo",
            estado: "Estado: ",
          }}
          statusType='M'
          tableKeys={["documento", "email", "estado"]}
          tableType='alumno'
        />
      </section>
    </>
  );
};

export default Alumnos;
