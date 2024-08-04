import React from "react";

// import classes from "./MatriculaHorarioFinal.module.css";
import Card from "../../shared/components/UIElements/Card";
import MatriculaHorarioFinalRegistro from "./MatriculaHorarioFinalRegistro";

const MatriculaHorarioFinal = (props) => {
  return (
    <Card>
      <ul className="header--horario">
        <li>Código Sección</li>
        <li>Curso</li>
        <li>Quitar</li>
      </ul>
      {props.horario.map((seccion) => (
        <MatriculaHorarioFinalRegistro
          onSaveRemoveSeccionData={props.onSaveRemoveSeccionData}
          key={seccion._id}
          seccion={seccion}
        />
      ))}
    </Card>
  );
};

export default MatriculaHorarioFinal;
