import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";

import FirstRow from "../../shared/components/PageRows/FirstRow";
import SecondRow from "../../shared/components/PageRows/SecondRow";
import Table from "../../shared/components/Table/Table";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
// import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useHttpClient } from "../../shared/hooks/http-hook";
// import DUMMY_CURSOS from "../../shared/util/dummy_cursos";

const Cursos = () => {
  const [todosActive, setTodosActive] = useState(true);
  const [activosActive, setActivosActive] = useState(false);
  const [noactivossActive, setNoactivosActive] = useState(false);
  const [triggerEffect, setTriggerEffect] = useState(false);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const history = useHistory();

  const [cursos, setCursos] = useState([]);
  useEffect(() => {
    const fetchCursos = async () => {
      try {
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + "/cursos/"
        );
        setCursos(responseData.cursos);
      } catch (error) {}
    };
    fetchCursos();
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
          process.env.REACT_APP_BACKEND_URL + `/cursos/${id}`,
          "PATCH",
          JSON.stringify({
            // eslint-disable-next-line
            estado: !cursos.find((curso) => curso._id == id).estado,
          }),
          {
            "Content-Type": "application/json",
          }
        );
        history.push("/curso");
        setTriggerEffect((prev) => !prev);
      } catch (error) {}
    };
    updateState();
  };
  let filterList;
  if (todosActive) filterList = cursos;
  if (activosActive) filterList = cursos.filter((curso) => curso.estado);
  if (noactivossActive) filterList = cursos.filter((curso) => !curso.estado);
  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      <section className="main-content">
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
          btn1="Activo"
          btn2="Inactivo"
          page="Cursos"
          total={filterList.length}
          style={{ width: "17rem" }}
        />
        <SecondRow title="Cursos" to="/curso/new" />

        <Table
          isLoading={isLoading}
          page={filterList}
          headerTable={[
            "Código",
            "Nombre",
            "Vacantes",
            "Estado",
            "Operación",
            "Acción",
          ]}
          headerModalKeys={["nombre"]}
          labelsModal={{
            codigo: "Codigo:",
            ciclo: "Ciclo:",
            nombre: "Nombre:",
            creditos: "Creditos",
            vacantes: "Vacantes:",
            estado: "Estado",
          }}
          statusType="A"
          tableKeys={["codigo", "nombre", "vacantes", "estado"]}
          tableType="curso"
          onChangeStatus={changeStatusHandler}
        />
      </section>
    </>
  );
};

export default Cursos;
