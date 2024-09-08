import { useState, useEffect } from "react";
import { Box, useTheme, Button, Dialog, DialogContent, DialogActions, Snackbar } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../../../theme";
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import Header from "../../../../components/Header";
import axios from "axios"; 
import MuiAlert from "@mui/material/Alert";



const FaceInfo = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [rows, setRows] = useState([]);
  const apiUrl = process.env.REACT_APP_APP_PYAUTENBIO;

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
      .get(`${apiUrl}/get_all_training_status/`)
      .then((response) => {
        // Asigna un id único a cada fila antes de actualizar el estado
        const rowsWithId = response.data.map((row, index) => ({
          ...row,
          id_tmp: index + 1,
        }));
        setRows(rowsWithId);
      })
      .catch((error) => {
        console.error("Error al obtener datos desde la API:", error);
      });
  }, [apiUrl]);

  const handleDeleteButtonClick  = (row) => {
    setSelectedRow(row);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedRow(null);
  };
  
  const handleDeleteConfirm = () => {
    const id = selectedRow.id;
    axios
      .delete(`${apiUrl}/delete_training_directory/${id}`)
      .then((response) => {
        const updatedRows = rows.filter((r) => r.id_tmp !== selectedRow.id_tmp);
        setRows(updatedRows);
        setSnackbarMessage("Registro de Face eliminado exitosamente.");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
      })
      .catch((error) => {
        console.error("Error al eliminar el Registro de Face:", error);
        setSnackbarMessage("Error al eliminar el Registro de Face.");
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

  const columns = [
    { 
      field: "id", 
      headerName: "ID", 
      flex: 1,
      cellClassName: "name-column--cell", 
    },
    {
      field: "is_trained",
      headerName: "Estado de Registro",
      flex: 1,
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
          </Box>
        );
      },
    },
  ];

  return (
    <Box m="20px">
      <Header
        title="REGISTRO DE ROSTROS"
        subtitle="Muestra las direcciones que tiene el modulo de reconocimiento facial
        para los rostros cuyo video ya fue procesado y se almacenaron sus respectivas
        codificaciones."
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
          getRowId={(row) => row.id_tmp}
        />
      </Box>

      {/* Dialogo de confirmación */}
      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogContent>
          ¿Estás seguro de que deseas eliminar este Registro?
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

export default FaceInfo;