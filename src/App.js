import { useState } from "react";
import { ColorModeContext, useMode } from "./theme";
import { Routes, Route } from "react-router-dom";
import { CssBaseline, ThemeProvider } from "@mui/material";

import Topbar from "./scenes/global/Topbar";
import Sidebar from "./scenes/global/Sidebar";
import Dashboard from "./scenes/dashboard";

import Calendar from "./scenes/calendar/calendar";

import Lugar from "./scenes/tablas/lugaresTrabajo/lugar";
import Horario from "./scenes/tablas/horarios/horario";
import Marcacion from "./scenes/tablas/marcaciones/marcacion";
import Login from "./scenes/tablas/logins/login";
import Usuario from "./scenes/tablas/usuarios/usuario";

import LugarInfo from "./scenes/tablas/lugaresTrabajo/lugarInfo";
import HorarioInfo from "./scenes/tablas/horarios/horarioInfo";
import MarcacionInfo from "./scenes/tablas/marcaciones/marcacionInfo";
import LoginInfo from "./scenes/tablas/logins/loginInfo";
import UsuarioInfo from "./scenes/tablas/usuarios/usuarioInfo";

import ActLugar from "./scenes/tablas/lugaresTrabajo/lugarActualizar/index";
import ActHorario from "./scenes/tablas/horarios/horarioActualizar/index";
import ActMarcacion from "./scenes/tablas/marcaciones/marcacionActualizar/index";
import ActLogin from "./scenes/tablas/logins/loginActualizar/index";
import ActUsuario from "./scenes/tablas/usuarios/usuarioActualizar/index";

import Face from "./scenes/tablas/faceAuth/face";
import FaceInfo from "./scenes/tablas/faceAuth/faceInfo";

function App() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          <Sidebar isSidebar={isSidebar} />
          <main className="content">
            <Topbar setIsSidebar={setIsSidebar} />

            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/calendar" element={<Calendar />} />

              <Route path="/lugaresTrabajo" element={<Lugar />} />
              <Route path="/horarios" element={<Horario />} />
              <Route path="/marcaciones" element={<Marcacion />} />
              <Route path="/logins" element={<Login />} />
              <Route path="/Usuarios" element={<Usuario />} />

              <Route path="/infoLugaresTrabajo" element={<LugarInfo />} />
              <Route path="/infoHorarios" element={<HorarioInfo />} />
              <Route path="/infoMarcaciones" element={<MarcacionInfo />} />
              <Route path="/infoLogins" element={<LoginInfo />} />
              <Route path="/infoUsuarios" element={<UsuarioInfo />} />

              <Route path="/actLugar/:id_lugar" element={<ActLugar />} />
              <Route path="/actHorario/:id_horario" element={<ActHorario />} />
              <Route path="/actMarcacion/:id_marcacion" element={<ActMarcacion />} />
              <Route path="/actLogin/:id_login" element={<ActLogin />} />
              <Route path="/actUsuario/:id_usuario" element={<ActUsuario />} />

              <Route path="/face" element={<Face />} />
              <Route path="/infoFace" element={<FaceInfo />} />
            </Routes>
          </main>
        </div>

        <div />
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;