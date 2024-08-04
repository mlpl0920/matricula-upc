import React from "react";

const MatriculaCursoRegistro = (props) => {
  const openHorario = (e) => {
    props.onSaveVerSeccionData(props.curso._id);
    document.querySelectorAll(".registro--curso i").forEach((icon) => {
      icon.style.color = "black";
      icon.style.zoom = 1;
    });
    e.target.style.color = "#573cd2";
    e.target.style.zoom = 1.2;
  };
  return (
    <ul className="registro--curso">
      <li>{props.curso.codigo}</li>
      <li>{props.curso.nombre}</li>
      <li>{props.curso.creditos}</li>
      <li>
        <i
          style={{ cursor: "pointer" }}
          onClick={openHorario}
          className="fas fa-eye"
        ></i>
      </li>
    </ul>
  );
};

export default MatriculaCursoRegistro;
