import React, { useState, useEffect } from "react";
import Card from "../../shared/components/UIElements/Card";

import "./MatriculaCursos.css";

import MatriculaCursoRegistro from "./MatriculaCursoRegistro";
import { useHttpClient } from "../../shared/hooks/http-hook";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";

const MatriculaCursos = (props) => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedCursos, setLoadedCursos] = useState();
  useEffect(() => {
    const fetchCursos = async () => {
      try {
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL +
            `/cursos/ciclo/${props.alumno.ciclo}`
        );
        setLoadedCursos(responseData.cursos);
      } catch (err) {}
    };
    fetchCursos();
  }, [sendRequest, props.alumno.ciclo]);
  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      <Card style={{ position: "relative" }}>
        {isLoading && <LoadingSpinner asOverlay />}
        <ul className="header--curso">
          <li>Código del Curso</li>
          <li>Nombre del Curso</li>
          <li>No. Créditos</li>
          <li>Visualizar Horarios</li>
        </ul>
        {!isLoading &&
          loadedCursos &&
          loadedCursos.map((curso) => (
            <MatriculaCursoRegistro
              onSaveVerSeccionData={props.onSaveVerSeccionData}
              key={curso._id}
              curso={curso}
            />
          ))}
      </Card>
    </>
  );
};

export default MatriculaCursos;
