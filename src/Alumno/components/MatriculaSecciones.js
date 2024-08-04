import React, { useContext, useState, useEffect } from "react";
import Card from "../../shared/components/UIElements/Card";

// import classes from "./MatriculaSecciones.module.css";

import MatriculaSeccionRegistro from "./MatriculaSeccionRegistro";
import { MatriculaContext } from "../../shared/context/matricula-context";
import { useHttpClient } from "../../shared/hooks/http-hook";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";

const MatriculaSecciones = (props) => {
  const matricula = useContext(MatriculaContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedSecciones, setLoadedSecciones] = useState();

  // console.log("Curso Id desde componente Secciones", matricula.cursoId);

  useEffect(() => {
    const fetchSecciones = async () => {
      try {
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL +
            `/secciones/curso/${matricula.cursoId}`
        );
        setLoadedSecciones(
          responseData.secciones.filter((seccion) => seccion.estado)
        );
      } catch (error) {}
    };
    if (matricula.cursoId) fetchSecciones();
  }, [sendRequest, matricula.cursoId]);
  let registrosSecciones;
  if (!isLoading && loadedSecciones) {
    registrosSecciones = loadedSecciones.map((seccion) => (
      <MatriculaSeccionRegistro
        onSaveAddSeccionData={props.onSaveAddSeccionData}
        key={seccion._id}
        seccion={seccion}
      />
    ));
    if (!isLoading && loadedSecciones.length === 0) {
      registrosSecciones = (
        <p style={{ width: "100%", textAlign: "center" }}>
          Este curso de momento no tiene secciones disponibles
        </p>
      );
    }
  }

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      <Card style={{ position: "relative" }}>
        {isLoading && <LoadingSpinner asOverlay />}
        <ul className="header--seccion">
          <li>Codigo</li>
          <li>Profesor</li>
          <li>Dias</li>
          <li>Hora</li>
          <li>Seleccionar</li>
        </ul>
        {registrosSecciones}
      </Card>
    </>
  );
};

export default MatriculaSecciones;
