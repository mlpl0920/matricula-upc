import React, { useContext } from "react";

import classes from "./TopNavigation.module.css";
import { AuthContext } from "../../context/auth-context";

const TopNavigation = (props) => {
  const auth = useContext(AuthContext);
  return (
    <nav className={`${classes.TopNavigation} ${props.className}`}>
      <div className={classes.LeftItem}>
        <i className="fas fa-school"></i>
        <h1>Matrícula Online</h1>
      </div>

      {!props.hideRightItem && (
        <div className={classes.RightItem}>
          <div className={classes.PreviewAdmin}>
            {auth.user && (
              <h3>
                {auth.user.nombres} {auth.user.apellidos}
              </h3>
            )}
            <p>Administrador de Matriculas</p>
          </div>
          {/* <div className={classes.Sort}>
            <i className="fas fa-sort-down"></i>
          </div> */}
        </div>
      )}
      {props.hideRightItem && props.customRightItem}
    </nav>
  );
};

export default TopNavigation;
