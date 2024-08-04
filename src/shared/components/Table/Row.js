import React, { useState } from "react";
import { Link } from "react-router-dom";

import "../UIElements/Modal.css";
import Button from "../FormElements/Button";
import Modal from "../UIElements/Modal";

const Row = (props) => {
  const [showDetalle, setShowDetalle] = useState(false);
  const openVerDetalleHandler = () => {
    setShowDetalle(true);
  };
  const closeVerDetalleHandler = () => {
    setShowDetalle(false);
  };

  let modalContent = Object.keys(props.row).map((key) => {
    if (key === "password") return null;
    if (key === "_id") return null;
    if (key === "secciones") return null;
    if (key === "profesor")
      return (
        <li key={key}>
          <strong>{props.labelsModal[key]}</strong>
          <p>{`${props.row[key].nombres} ${props.row[key].apellidos}`}</p>
        </li>
      );
    if (key === "curso")
      return (
        <li key={key}>
          <strong>{props.labelsModal[key]}</strong>
          <p>{props.row[key].nombre}</p>
        </li>
      );
    if (key === "linkedin")
      return (
        <li key={key}>
          <strong>{props.labelsModal[key]}</strong>
          <a href={props.row[key]}>
            <i style={{ fontSize: "25px" }} className="fab fa-linkedin"></i>
          </a>
        </li>
      );
    if (key === "estado" && props.statusType === "M")
      return (
        <li key={key}>
          <strong>{props.labelsModal[key]}</strong>
          <p>{props.row[key] ? "Matriculado" : "No Matriculado"}</p>
        </li>
      );
    if (key === "estado" && props.statusType === "A")
      return (
        <li key={key}>
          <strong>{props.labelsModal[key]}</strong>
          <p>{props.row[key] ? "Activo" : "Inactivo"}</p>
        </li>
      );

    return (
      <li key={key}>
        <strong>{props.labelsModal[key]}</strong> <p>{props.row[key]}</p>
      </li>
    );
  });
  const rows = props.tableKeys.map((key) => {
    if (key === "curso")
      return (
        <td key={key} style={{ width: `calc(100% / ${props.nItems})` }}>
          {props.row[key].nombre}
        </td>
      );
    if (key === "profesor")
      return (
        <td key={key} style={{ width: `calc(100% / ${props.nItems})` }}>
          {`${props.row[key].nombres} ${props.row[key].apellidos}`}
        </td>
      );
    if (key === "estado" && props.statusType === "M")
      return (
        <td key={key} style={{ width: `calc(100% / ${props.nItems})` }}>
          <p className={props.row[key] ? "active" : "inactive"}>
            {props.row[key] ? "Matriculado" : "No Matriculado"}
          </p>
        </td>
      );
    if (key === "estado" && props.statusType === "A")
      return (
        <td key={key} style={{ width: `calc(100% / ${props.nItems})` }}>
          <p className={props.row[key] ? "active" : "inactive"}>
            {props.row[key] ? "Activo" : "Inactivo"}
          </p>
        </td>
      );
    return (
      <td key={key} style={{ width: `calc(100% / ${props.nItems})` }}>
        {props.row[key]}
      </td>
    );
  });
  let actionButton;
  if (props.statusType === "M") {
    actionButton = (
      <Button to={`/${props.tableType}/${props.row._id}/matricula`} zoom={0.7}>
        {props.row.estado ? "Editar Matricula" : "Matricular"}
      </Button>
    );
  }
  if (props.statusType === "A") {
    actionButton = (
      <Button
        onClick={props.onChangeStatus.bind(this, props.row._id)}
        zoom={0.7}
      >
        Cambiar Estado
      </Button>
    );
  }
  return (
    <>
      <Modal
        show={showDetalle}
        onCancel={closeVerDetalleHandler}
        header={props.headerModal}
        footer={
          <Button onClick={closeVerDetalleHandler} danger>
            Cerrar
          </Button>
        }
        contentClass="place-item__modal-content"
        footerClass="place-item__modal-actions"
      >
        <ul className="ListView">{modalContent}</ul>
      </Modal>
      <tr className="row100 body">
        {rows}
        <td className="Icons" style={{ width: `calc(100% / ${props.nItems})` }}>
          <Link to={`${props.tableType}/update/${props.row._id}`}>
            <i className="fas fa-pencil-alt"></i>
          </Link>
          <i
            style={{ cursor: "pointer" }}
            onClick={openVerDetalleHandler}
            className="fas fa-eye"
          ></i>
        </td>
        <td style={{ width: `calc(100% / ${props.nItems})` }}>
          {actionButton}
        </td>
      </tr>
    </>
  );
};

export default Row;
