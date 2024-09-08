import { useState } from "react";
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { Link } from "react-router-dom";
import "react-pro-sidebar/dist/css/styles.css";
import { tokens } from "../../theme";
import PinDropOutlinedIcon from '@mui/icons-material/PinDropOutlined';
import ScheduleOutlinedIcon from '@mui/icons-material/ScheduleOutlined';
import WorkHistoryOutlinedIcon from '@mui/icons-material/WorkHistoryOutlined';
import LoginOutlinedIcon from '@mui/icons-material/LoginOutlined';
import PermIdentityOutlinedIcon from '@mui/icons-material/PermIdentityOutlined';
import AddLocationAltOutlinedIcon from '@mui/icons-material/AddLocationAltOutlined';
import MoreTimeOutlinedIcon from '@mui/icons-material/MoreTimeOutlined';
import AddTaskOutlinedIcon from '@mui/icons-material/AddTaskOutlined';
import AddModeratorOutlinedIcon from '@mui/icons-material/AddModeratorOutlined';
import PersonAddAltOutlinedIcon from '@mui/icons-material/PersonAddAltOutlined';
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import AddReactionOutlinedIcon from '@mui/icons-material/AddReactionOutlined';
import ContactPageOutlinedIcon from '@mui/icons-material/ContactPageOutlined';
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import { useAuth } from "../../AuthContext";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

const Item = ({ title, to, icon, selected, setSelected }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const admin_username = process.env.REACT_APP_ADMIN_DASHBOARD_USERNAME;
  const admin_password = process.env.REACT_APP_ADMIN_DASHBOARD_PASSWORD;

  const { username, password } = useAuth();

  const [isAdminLoged, setIsAdminLoged] = useState(null);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("error");

  const handleClick = () => {
    //setIsAdminLoged(false);
    if (username === admin_username && password === admin_password ) {
      setSelected(title);
      setIsAdminLoged(true);
    } else {
      const errorMessage = `Usuario: ${username} no tiene acceso a esta acción...`;
      setIsAdminLoged(false);
      setSnackbarMessage(errorMessage);
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };
  
  return (
    <MenuItem
      active={selected === title}
      style={{
        color: colors.grey[100],
      }}
      onClick={handleClick}
      icon={icon}
    >
      <Typography>{title}</Typography>
      <Link to={isAdminLoged ? to : "/"} />
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <MuiAlert elevation={6} variant="filled" severity={snackbarSeverity} onClose={handleCloseSnackbar}>
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>
    </MenuItem>
    
  );
};

const Sidebar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selected, setSelected] = useState("Dashboard");

  return (
    <Box
      sx={{
        "& .pro-sidebar-inner": {
          background: `${colors.primary[400]} !important`,
        },
        "& .pro-icon-wrapper": {
          backgroundColor: "transparent !important",
        },
        "& .pro-inner-item": {
          padding: "5px 35px 5px 20px !important",
        },
        "& .pro-inner-item:hover": {
          color: "#868dfb !important",
        },
        "& .pro-menu-item.active": {
          color: "#6870fa !important",
        },
      }}
    >
      <ProSidebar collapsed={isCollapsed}>
        <Menu iconShape="square">
          {/* LOGO AND MENU ICON */}
          <MenuItem
            onClick={() => setIsCollapsed(!isCollapsed)}
            icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
            style={{
              margin: "10px 0 20px 0",
              color: colors.grey[100],
            }}
          >
            {!isCollapsed && (
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                ml="15px"
              >
                <Typography variant="h3" color={colors.grey[100]}>
                  SRAB V.1.0
                </Typography>
                <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                  <MenuOutlinedIcon />
                </IconButton>
              </Box>
            )}
          </MenuItem>

          {!isCollapsed && (
            <Box mb="25px">
              <Box display="flex" justifyContent="center" alignItems="center">
                <img
                  alt="profile-user"
                  width="75px"
                  height="75px"
                  src={`../../assets/user.png`}
                  style={{ cursor: "pointer", borderRadius: "50%" }}
                />
              </Box>
              <Box textAlign="center">
                <Typography
                  variant="h2"
                  color={colors.grey[100]}
                  fontWeight="bold"
                  sx={{ m: "10px 0 0 0" }}
                >
                  Panel de Administración
                </Typography>
                {/* <Typography variant="h5" color={colors.greenAccent[500]}>
                  Panel de Administración
                </Typography> */}
              </Box>
            </Box>
          )}

          <Box paddingLeft={isCollapsed ? undefined : "10%"}>
            <Item
              title="Dashboard"
              to="/"
              icon={<HomeOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />

            <Typography
              variant="h6"
              color={colors.grey[300]}
              sx={{ m: "15px 0 5px 20px" }}
            >
              Información
            </Typography>

            <Item
              title="Lugares Trabajo"
              to="/infoLugaresTrabajo"
              icon={<PinDropOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Horarios"
              to="/infoHorarios"
              icon={<ScheduleOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Marcaciones"
              to="/infoMarcaciones"
              icon={<WorkHistoryOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Logins"
              to="/infoLogins"
              icon={<LoginOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Usuarios"
              to="/infoUsuarios"
              icon={<PermIdentityOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />

            <Typography
              variant="h6"
              color={colors.grey[300]}
              sx={{ m: "15px 0 5px 20px" }}
            >
              Agregar
            </Typography>

            <Item
              title="Lugares Trabajo"
              to="/lugaresTrabajo"
              icon={<AddLocationAltOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Horarios"
              to="/horarios"
              icon={<MoreTimeOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Marcaciones"
              to="/marcaciones"
              icon={<AddTaskOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Logins"
              to="/logins"
              icon={<AddModeratorOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Usuarios"
              to="/Usuarios"
              icon={<PersonAddAltOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />

            <Item
              title="Calendario"
              to="/calendar"
              icon={<CalendarTodayOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Typography
              variant="h6"
              color={colors.grey[300]}
              sx={{ m: "15px 0 5px 20px" }}
            >
              Autenticación
            </Typography>
            <Item
              title="Reconocimiento Facial"
              to="/face"
              icon={<AddReactionOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Registros Procesados"
              to="/infoFace"
              icon={<ContactPageOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
          </Box>
        </Menu>
      </ProSidebar>
    </Box>
  );
};

export default Sidebar;
