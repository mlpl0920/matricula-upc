import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";

import { useParams } from "react-router-dom";

import MatriculaCursos from "../components/MatriculaCursos";
import MatriculaHorarioFinal from "../components/MatriculaHorarioFinal";
import MatriculaSecciones from "../components/MatriculaSecciones";
import Button from "../../shared/components/FormElements/Button";
import classes from "./Matricula.module.css";
import { useHttpClient } from "../../shared/hooks/http-hook";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import { MatriculaContext } from "../../shared/context/matricula-context";
const Matricula = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const history = useHistory();

  const { alumnoId } = useParams();
  const [loadedAlumno, setLoadedAlumno] = useState();
  const [horario, setHorario] = useState();
  const [cursoId, setCursoId] = useState();
  const [erroresMatricula, setErroresMatricula] = useState(false);
  useEffect(() => {
    const fetchAlumno = async () => {
      try {
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + `/alumnos/${alumnoId}`
        );
        setLoadedAlumno(responseData.alumno);
        setHorario([...responseData.alumno.secciones]);
      } catch (err) {}
    };
    fetchAlumno();
  }, [sendRequest, alumnoId]);
  //se va a inicializar con el horaio actual que tiene el alumno
  // const [horario, setHorario] = useState([]);
  const saveVerSeccionData = (cursoId) => {
    setCursoId(cursoId);
  };

  const saveAddSeccionData = (seccionData) => {
    //Tenemos que restar -1 porque estamos verificando antes que se añada
    const LIMIT = 5;
    if (horario.length > LIMIT - 1) {
      //alert(`Solo te puedes matricular en ${LIMIT} cursos como máximo`);
      setErroresMatricula(
        `Solo te puedes matricular en ${LIMIT} cursos como máximo`
      );
      return;
    }
    // eslint-disable-next-line
    if (horario.find((seccion) => seccionData.curso._id == seccion.curso._id)) {
      //alert("Ya agregaste este curso");
      setErroresMatricula("Ya agregaste este curso");
      return;
    }
    setHorario((prevHorario) => [...prevHorario, seccionData]);
    // setHorario((prevHorario) => {
    //   return [...prevHorario, data];
    // });
  };
  const saveRemoveSeccionData = (seccionId) => {
    setHorario((prevHorario) => {
      const prevHorarioCopy = [...prevHorario];
      let newHorario = [];
      prevHorarioCopy.forEach((seccion) => {
        const seccionCopy = { ...seccion };
        if (seccionCopy._id !== seccionId) newHorario.push(seccionCopy);
      });
      return newHorario;
    });
  };
  const saveHorarioHandler = () => {
    const updateSeccionesAlumno = async () => {
      try {
        await sendRequest(
          process.env.REACT_APP_BACKEND_URL + `/alumnos/${alumnoId}`,
          "PATCH",
          JSON.stringify({
            secciones: horario.map((seccion) => seccion._id),
          }),
          {
            "Content-Type": "application/json",
          }
        );
        history.push("/alumno");
      } catch (error) {}
    };
    updateSeccionesAlumno();
  };
  const clearErrorMatricula = () => {
    setErroresMatricula(false);
  };
  return (
    <MatriculaContext.Provider value={{ cursoId }}>
      <ErrorModal error={error} onClear={clearError} />
      <ErrorModal error={erroresMatricula} onClear={clearErrorMatricula} />
      <section className="main-content">
        {isLoading && <LoadingSpinner asOverlay />}
        <div className={classes.FirstRow}>
          <div className={classes.Cursos}>
            <h3>Cursos Disponibles</h3>
            {!isLoading && loadedAlumno && (
              <MatriculaCursos
                onSaveVerSeccionData={saveVerSeccionData}
                alumno={loadedAlumno}
              />
            )}
          </div>
          <div className={classes.Horario}>
            <h3>Posible Horario</h3>
            {!isLoading && loadedAlumno && horario && (
              <MatriculaHorarioFinal
                onSaveRemoveSeccionData={saveRemoveSeccionData}
                horario={horario}
              />
            )}
            <Button
              onClick={saveHorarioHandler}
              //disabled={!horario || horario.length === 0}
            >
              Guardar
            </Button>
          </div>
        </div>
        <div>
          <h3>Secciones</h3>
          {!isLoading && loadedAlumno && (
            <MatriculaSecciones onSaveAddSeccionData={saveAddSeccionData} />
          )}
        </div>
      </section>
    </MatriculaContext.Provider>
  );
};

export default Matricula;
