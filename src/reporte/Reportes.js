/** @format */

import React, { useState, useEffect } from "react";
import SecondRow from "../shared/components/PageRows/SecondRow";

// import AlumnoTable from "../components/AlumnoTable";
import Table from "../shared/components/Table/Table";
import ErrorModal from "../shared/components/UIElements/ErrorModal";
// import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useHttpClient } from "../shared/hooks/http-hook";
import { useHistory } from "react-router-dom";

// import classes from "./Alumnos.module.css";

const Reportes = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const [alumnos, setAlumnos] = useState([]);
  const [profesores, setProfesores] = useState([]);
  const [ciclos, setCiclos] = useState([]);
  const [cursos, setCursos] = useState([]);
  const [typeReport, setTypeReport] = useState("semestre");
  const [tableType, setTableType] = useState("alumno");
  const [triggerEffect, setTriggerEffect] = useState(false);
  const history = useHistory();

  useEffect(() => {
    const fetchAlumnos = async () => {
      try {
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + "/alumnos/"
        );
        setAlumnos(responseData.alumnos);
        setCiclos(responseData.ciclos);
        setCursos(responseData.cursos);
      } catch (error) {}
    };
    const fetchProfesores = async () => {
      try {
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + "/profesores/"
        );
        setProfesores(responseData.profesores);
      } catch (error) {}
    };
    (async function () {
      await fetchAlumnos();
      await fetchProfesores();
    })();
  }, [sendRequest, triggerEffect]);

  const changeSelectSemestreHandler = (e) => {
    const semestre = e.target.value;
    const updateAlumnos = async () => {
      try {
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + `/alumnos/semestre/${semestre}`
        );
        setAlumnos(responseData.alumnos);
      } catch (error) {}
    };
    updateAlumnos();
  };

  const changeSelectCicloHandler = (e) => {
    const ciclo = e.target.value;
    const updateAlumnos = async () => {
      try {
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + `/alumnos/ciclo/${ciclo}`
        );
        setAlumnos(responseData.alumnos);
      } catch (error) {}
    };
    updateAlumnos();
  };

  const changeSelectTypeReport = (e) => {
    const report = e.target.value;
    if (report === "profesor") setTableType("profesor");
    else setTableType("alumno");
    setTypeReport(report);
  };
  const changeSelectCursoHandler = (e) => {
    const cursoId = e.target.value;
    const updateAlumnos = async () => {
      try {
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + `/alumnos/curso/${cursoId}`
        );
        setAlumnos(responseData.alumnos);
      } catch (error) {}
    };
    const updateProfesores = async () => {
      try {
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + `/profesores/curso/${cursoId}`
        );
        setProfesores(responseData.profesores);
      } catch (error) {}
    };
    if (typeReport === "curso") updateAlumnos();
    if (typeReport === "profesor") updateProfesores();
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
  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      <section className='main-content'>
        <form
          style={{
            "margin-top": "2rem",
            "margin-bottom": "2rem",
            display: "flex",
            "align-items": "center",
          }}>
          <select onChange={changeSelectTypeReport}>
            <option value='semestre' selected>
              Alumnos por semestre
            </option>
            <option value='ciclo'>Alumnos por ciclo</option>
            <option value='curso'>Alumnos por curso</option>
            <option value='profesor'>Profesores por curso</option>
          </select>
          {typeReport === "semestre" && (
            <select onChange={changeSelectSemestreHandler}>
              <option value={0}>Todos</option>
              <option value='2021-1'>2021-1</option>
              <option value='2021-2'>2021-2</option>
              <option value='2022-0'>2022-0</option>
            </select>
          )}
          {typeReport === "ciclo" && (
            <select onChange={changeSelectCicloHandler}>
              <option value={0}>Todos</option>
              {ciclos.map((ciclo) => (
                <option value={ciclo}>Ciclo {ciclo}</option>
              ))}
            </select>
          )}
          {typeReport === "curso" && (
            <select onChange={changeSelectCursoHandler}>
              <option value={0}>Todos</option>
              {cursos.map((curso) => (
                <option value={curso._id}>{curso.nombre}</option>
              ))}
            </select>
          )}
          {typeReport === "profesor" && (
            <select onChange={changeSelectCursoHandler}>
              <option value={0}>Todos</option>
              {cursos.map((curso) => (
                <option value={curso._id}>{curso.nombre}</option>
              ))}
            </select>
          )}
        </form>
        {tableType === "alumno" && (
          <Table
            isLoading={isLoading}
            page={alumnos}
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
            tableType={tableType}
          />
        )}
        {tableType === "profesor" && profesores && (
          <Table
            isLoading={isLoading}
            page={profesores}
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
              sexo: "Sexo:",
              email: "Correo:",
              telefono: "Telefono",
              direccion: "Direccion: ",
              estado: "Estado: ",
              linkedin: "Linkedin: ",
            }}
            statusType='A'
            tableKeys={["documento", "email", "estado"]}
            tableType={tableType}
            onChangeStatus={changeStatusHandler}
          />
        )}
      </section>
    </>
  );
};

export default Reportes;
