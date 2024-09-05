import React, { useContext, useState } from "react";
import {
  Box,
  IconButton,
  useTheme,
  Dialog,
  DialogContent,
  InputBase,
  Button,
} from "@mui/material";
import { ColorModeContext, tokens } from "../../theme";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import { useAuth } from "../../AuthContext";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

const Topbar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { username, setUsername, password, setPassword } = useAuth();

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const handleDialogOpen = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleLogin = () => {

    const successMessage = ` Sesion iniciada para el Usuario: ${username}`;
    setSnackbarMessage(successMessage);
    setSnackbarSeverity("success");
    setSnackbarOpen(true);

    setUsername(username)
    setPassword(password)

    handleDialogClose();
  };

  const handleLogout = () => {
    const successMessage = ` Cerrando sesion del Usuario: ${username}`;
    setSnackbarMessage(successMessage);
    setSnackbarSeverity("info");
    setSnackbarOpen(true);

    setUsername("invitado")
    setPassword("invitado")

    handleDialogClose();
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <Box display="flex" justifyContent="space-between" p={1}>

      <Box
        display="flex"
        backgroundColor={colors.primary[400]}
        borderRadius="3px"
      >
      </Box>
      
      {/* ICONS */}
      <Box display="flex">
        <IconButton onClick={colorMode.toggleColorMode}>
          {theme.palette.mode === "dark" ? (
            <DarkModeOutlinedIcon />
          ) : (
            <LightModeOutlinedIcon />
          )}
        </IconButton>
        <IconButton onClick={handleDialogOpen}>
          <PersonOutlinedIcon />
        </IconButton>
      </Box>

      {/* Dialog */}
      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogContent>
          <InputBase
            placeholder="Usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <InputBase
            placeholder="Contraseña"
            type={"password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button variant="contained" color="primary" onClick={handleLogin}>
            Iniciar Sesión
          </Button>
          <Button variant="contained" color="primary" onClick={handleLogout}>
            Cerrar Sesión
          </Button>
        </DialogContent>
      </Dialog>
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <MuiAlert elevation={6} variant="filled" severity={snackbarSeverity} onClose={handleCloseSnackbar}>
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>
    </Box>
  );
};

export default Topbar;
