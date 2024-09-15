import { useState, useEffect } from "react";
import { Box, useTheme, Button, Dialog, DialogContent, DialogActions, Snackbar } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../../../theme";
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import Header from "../../../../components/Header";
import axios from "axios"; 
import { useNavigate} from 'react-router-dom';
import MuiAlert from "@mui/material/Alert";

const HorarioInfo = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [rows, setRows] = useState([]);
  const navigate = useNavigate(); 
  const apiUrl = window._env_.REACT_APP_APP_HORARIOS_URL;

  const [openDialog, setDialogOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  useEffect(() => {
    if (!apiUrl) {
      console.error("La URL de la API no está configurada correctamente.");
      return;
    }
    axios
      .get(`${apiUrl}/horario`)
      .then((response) => {
        // Asigna un id único a cada fila antes de actualizar el estado
        const rowsWithId = response.data.map((row, index) => ({
          ...row,
          id: index + 1,
        }));
        setRows(rowsWithId);
      })
      .catch((error) => {
        console.error("Error al obtener datos desde la API:", error);
      });
  }, [apiUrl]);

  const editar = (row) => {
    const { id_horario, diasHorario, nombre } = row;
    navigate(`/actHorario/${id_horario}`, {
      state: {
        diasHorario,
        nombre,
      },
    });
  };
  
  const handleDeleteButtonClick  = (row) => {
    setSelectedRow(row);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedRow(null);
  };

  const handleDeleteConfirm = (row) => {
    const id = selectedRow.id_horario;
    axios
      .delete(`${apiUrl}/horario/${id}`)
      .then((response) => {
        const updatedRows = rows.filter((r) => r.id !== selectedRow.id);
        setRows(updatedRows);
        setSnackbarMessage("Horario eliminado exitosamente.");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
      })
      .catch((error) => {
        console.error("Error al eliminar el horario:", error);
        setSnackbarMessage("Error al eliminar el horario.");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      })
      .finally(() => {
        handleDialogClose();
      });
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const formatDiasHorario = (diasHorario) => {
    return diasHorario.map((dia) => {
      return `${dia.diaSemana}: ${dia.horaEntrada} - ${dia.horaSalida}`;
    }).join(", ");
  };

  const columns = [
    { 
      field: "id_horario", 
      headerName: "ID", 
      flex: 0.5 
    },
    {
      field: "nombre",
      headerName: "Nombre",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "diasHorario",
      headerName: "Días y Horarios",
      flex: 4,
      renderCell: (params) => formatDiasHorario(params.row.diasHorario),
    },
    {
      headerName: "Opciones",
      flex: 1,
      renderCell: ({ row }) => {
        return (
          <Box display="flex" alignItems="center" justifyContent="center">
            <Button
              onClick={() => handleDeleteButtonClick(row)}
              variant="contained"
              style={{ width: "30%" }}
              sx={{ textAlign: "center" }}
              startIcon={<DeleteForeverOutlinedIcon />}
            />
            <Button
              onClick={() => editar(row)}
              variant="variable"
              style={{ width: "30%" }}
              sx={{ textAlign: "center" }}
              startIcon={<BorderColorIcon />}
            />
          </Box>
        );
      },
    },
  ];

  return (
    <Box m="20px">
      <Header
        title="HORARIOS"
        subtitle="Lista de horarios disponibles para asignación."
      />
      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .name-column--cell": {
            color: colors.greenAccent[300],
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${colors.grey[100]} !important`,
          },
        }}
      >
        <DataGrid
          rows={rows}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
          getRowId={(row) => row.id}
        />
      </Box>
      {/* Dialogo de confirmación */}
      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogContent>
          ¿Estás seguro de que deseas eliminar este Horario?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleDeleteConfirm} color="secondary">
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar de notificación */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <MuiAlert
          elevation={6}
          variant="filled"
          severity={snackbarSeverity}
          onClose={handleCloseSnackbar}
        >
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>
    </Box>
  );
};

export default HorarioInfo;
