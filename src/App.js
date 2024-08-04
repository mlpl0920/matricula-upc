import React, { useState, useCallback, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from "react-router-dom";

import Administradores from "./Admin/pages/Administradores";
import Alumnos from "./Alumno/pages/Alumnos";
import Matricula from "./Alumno/pages/Matricula";
import Profesores from "./Profesor/pages/Profesores";
import Secciones from "./Seccion/pages/Secciones";
import Auth from "./Admin/pages/Auth/Auth";
import TopNavigation from "./shared/components/Navigation/TopNavigation";
import LeftNavigation from "./shared/components/Navigation/LeftNavigation";
import NewAlumno from "./Alumno/pages/NewAlumno";
import UpdateAlumno from "./Alumno/pages/UpdateAlumno";
import NewProfesor from "./Profesor/pages/NewProfesor";
import UpdateProfesor from "./Profesor/pages/UpdateProfesor";
import NewAdministrador from "./Admin/pages/NewAdministrador";
import UpdateAdministrador from "./Admin/pages/UpdateAdministrador";
import NewSeccion from "./Seccion/pages/NewSeccion";
import UpdateSeccion from "./Seccion/pages/UpdateSeccion";
import UpdateCurso from "./Curso/pages/UpdateCurso";

import Cursos from "./Curso/pages/Cursos";
import NewCurso from "./Curso/pages/NewCurso";
import { AuthContext } from "./shared/context/auth-context";
import Reportes from "./reporte/Reportes";
let logoutTimer;

function App() {
  const [token, setToken] = useState(false);
  const [tokenExpirationDate, setTokenExpirationDate] = useState();
  const [user, setUser] = useState(false);

  const login = useCallback((admin, token, expirationDate) => {
    setToken(token);
    setUser(admin);
    const tokenExpirationDate =
      expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60);
    setTokenExpirationDate(tokenExpirationDate);
    localStorage.setItem(
      "adminData",
      JSON.stringify({
        admin,
        token,
        expiration: tokenExpirationDate.toISOString(),
      })
    );
  }, []);
  const logout = useCallback(() => {
    setToken(null);
    setTokenExpirationDate(null);
    setUser(null);
    localStorage.removeItem("adminData");
  }, []);

  useEffect(() => {
    if (token && tokenExpirationDate) {
      const remainingTime = tokenExpirationDate.getTime() - new Date();
      logoutTimer = setTimeout(logout, remainingTime);
    } else {
      clearTimeout(logoutTimer);
    }
  }, [token, logout, tokenExpirationDate]);

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("adminData"));
    if (
      storedData &&
      storedData.token &&
      new Date(storedData.expiration) > new Date()
    ) {
      login(
        storedData.admin,
        storedData.token,
        new Date(storedData.expiration)
      );
    }
  }, [login]);

  let routes;
  if (token) {
    routes = (
      <Switch>
        {/* ADMIN ROUTES */}

        <Route path="/admin" exact>
          {user && user.permiso === "principal" && <Administradores />}
        </Route>
        <Route path="/admin/new" exact>
          {user && user.permiso === "principal" && <NewAdministrador />}
        </Route>
        <Route path="/admin/update/:adminId" exact>
          {user && user.permiso === "principal" && <UpdateAdministrador />}
        </Route>

        {/* ALUMNO ROUTES */}
        <Route path="/alumno" exact>
          <Alumnos />
        </Route>
        <Route path="/alumno/new" exact>
          <NewAlumno />
        </Route>
        <Route path="/alumno/update/:alumnoId" exact>
          <UpdateAlumno />
        </Route>
        <Route path="/alumno/:alumnoId/matricula" exact>
          <Matricula />
        </Route>
        {/* PROFESOR ROUTES */}
        <Route path="/profesor" exact>
          <Profesores />
        </Route>
        <Route path="/profesor/new" exact>
          <NewProfesor />
        </Route>
        <Route path="/profesor/update/:profesorId" exact>
          <UpdateProfesor />
        </Route>
        {/* SECCION ROUTES */}
        <Route path="/seccion" exact>
          <Secciones />
        </Route>
        <Route path="/seccion/new" exact>
          <NewSeccion />
        </Route>
        <Route path="/seccion/update/:seccionId" exact>
          <UpdateSeccion />
        </Route>
        {/* SECCION CURSO */}
        <Route path="/curso" exact>
          <Cursos />
        </Route>
        <Route path="/curso/new" exact>
          <NewCurso />
        </Route>
        <Route path="/curso/update/:cursoId" exact>
          <UpdateCurso />
        </Route>
        {/* SECCION CURSO */}
        <Route path="/reporte" exact>
          <Reportes />
        </Route>
        <Redirect to="/alumno" />
      </Switch>
    );
  } else {
    routes = (
      <Switch>
        {/* AUTH ROUTES */}
        <Route path="/login" exact>
          <Auth />
        </Route>
        <Redirect to="/login" />
      </Switch>
    );
  }
  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!token,
        token,
        login,
        logout,
        user,
      }}
    >
      <Router>
        {token && <TopNavigation />}
        <div className={token && "container-main-content"}>
          {token && <LeftNavigation />}
          <Switch>{routes}</Switch>
        </div>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
