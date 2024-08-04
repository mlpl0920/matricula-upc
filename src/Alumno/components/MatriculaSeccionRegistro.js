import React from "react";

const MatriculaSeccionRegistro = (props) => {
  const addSeccionToHorario = () => {
    props.onSaveAddSeccionData(props.seccion);
  };
  return (
    <ul className="registro--seccion">
      <li>{props.seccion.codigo}</li>
      <li>{`${props.seccion.profesor.nombres} ${props.seccion.profesor.apellidos}`}</li>
      <li>{props.seccion.dia}</li>
      <li>{props.seccion.hora}</li>

      <li>
        <i onClick={addSeccionToHorario} className="fas fa-plus"></i>
      </li>
    </ul>
  );
};

export default MatriculaSeccionRegistro;
