import React, { useContext } from "react";
import { NavLink } from "react-router-dom";

import classes from "./LeftNavigation.module.css";

import { AuthContext } from "../../context/auth-context";
const LeftNavigation = (props) => {
  const auth = useContext(AuthContext);
  const cerrarSesionHandler = () => {
    auth.logout();
  };
  return (
    <ul className={classes.LeftNavigation}>
      <NavLink to="/alumno">
        <li>
          <i className="fas fa-user-graduate"></i>
          Alumnos
        </li>
      </NavLink>
      <NavLink to="/profesor">
        <li>
          <i className="fas fa-user-tie"></i>
          Profesores
        </li>
      </NavLink>
      <NavLink to="/seccion">
        <li>
          <i className="far fa-calendar"></i>
          Secciones
        </li>
      </NavLink>
      {auth.user && auth.user.permiso === "principal" && (
        <NavLink to="/admin">
          <li>
            <i className="fas fa-user-cog"></i>
            Administradores
          </li>
        </NavLink>
      )}
      <NavLink to="/curso">
        <li>
          <i className="fas fa-book"></i>
          Cursos
        </li>
      </NavLink>
      <NavLink to="/reporte">
        <li>
          <i className="far fa-chart-bar"></i>
          Reportes
        </li>
      </NavLink>

      <li style={{ cursor: "pointer" }} onClick={cerrarSesionHandler}>
        <i className="fas fa-sign-out-alt"></i>
        Cerrar Sesión
      </li>
    </ul>
  );
};

export default LeftNavigation;
