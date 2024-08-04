const MatriculaHorarioFinalRegistro = (props) => {
  const removeSeccionToHorario = () => {
    props.onSaveRemoveSeccionData(props.seccion._id);
  };
  return (
    <ul className="registro--horario">
      <li>{props.seccion.codigo}</li>
      <li>{props.seccion.curso.nombre}</li>
      <li>
        <i onClick={removeSeccionToHorario} className="fas fa-minus"></i>
      </li>
    </ul>
  );
};

export default MatriculaHorarioFinalRegistro;
