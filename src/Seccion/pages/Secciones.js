import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";

import FirstRow from "../../shared/components/PageRows/FirstRow";
import SecondRow from "../../shared/components/PageRows/SecondRow";
import Table from "../../shared/components/Table/Table";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
// import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useHttpClient } from "../../shared/hooks/http-hook";

const Secciones = () => {
  const [todosActive, setTodosActive] = useState(true);
  const [activosActive, setActivosActive] = useState(false);
  const [noactivossActive, setNoactivosActive] = useState(false);
  const [triggerEffect, setTriggerEffect] = useState(false);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const history = useHistory();
  const [secciones, setSecciones] = useState([]);

  useEffect(() => {
    const fetchSecciones = async () => {
      try {
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + "/secciones/"
        );
        setSecciones(responseData.secciones);
      } catch (error) {}
    };
    fetchSecciones();
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
  const changeStatusHandler = async (id) => {
    const updateState = async () => {
      try {
        await sendRequest(
          process.env.REACT_APP_BACKEND_URL + `/secciones/${id}`,
          "PATCH",
          JSON.stringify({
            // eslint-disable-next-line
            estado: !secciones.find((seccion) => seccion._id == id).estado,
          }),
          {
            "Content-Type": "application/json",
          }
        );
        history.push("/seccion");
        setTriggerEffect((prev) => !prev);
      } catch (error) {}
    };
    updateState();
  };
  let filterList;
  if (todosActive) filterList = secciones;
  if (activosActive) filterList = secciones.filter((seccion) => seccion.estado);
  if (noactivossActive)
    filterList = secciones.filter((seccion) => !seccion.estado);
  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      <section className="main-content">
        <FirstRow
          todosActive={todosActive}
          btn1Active={activosActive}
          btn2Active={noactivossActive}
          onTodos={todosActiveHandler}
          onBtn1={activosActiveHandler}
          onBtn2={noactivossActiveHandler}
          btn1="Activo"
          btn2="Inactivo"
          page="Secciones"
          total={filterList.length}
          style={{ width: "17rem" }}
        />
        <SecondRow title="Secciones" to="/seccion/new" />
        <Table
          isLoading={isLoading}
          page={filterList}
          headerTable={[
            "Código",
            "Curso",
            "Profesor",
            "Estado",
            "Operación",
            "Acción",
          ]}
          headerModalKeys={["codigo"]}
          labelsModal={{
            codigo: "Codigo de sección: ",
            dia: "Día:",
            hora: "Hora:",
            profesor: "Profesor:",
            curso: "Curso:",
            modalidad: "Modalidad:",
            estado: "Estado: ",
          }}
          statusType="A"
          tableKeys={["codigo", "curso", "profesor", "estado"]}
          tableType="seccion"
          onChangeStatus={changeStatusHandler}
        />
      </section>
    </>
  );
};

export default Secciones;
