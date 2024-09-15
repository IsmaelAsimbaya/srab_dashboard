import { useState, useEffect } from "react";
import { Box, useTheme, Button, Dialog, DialogContent, DialogActions, Snackbar } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../../../theme";
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import Header from "../../../../components/Header";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import MuiAlert from "@mui/material/Alert";


const MarcacionInfo = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [rows, setRows] = useState([]);
  const navigate = useNavigate();
  const apiUrl = window._env_.REACT_APP_APP_MARCACIONES_URL;

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
      .get(`${apiUrl}/marcacion`)
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

  const editar = (props) => {
    const {
      id_marcacion,
      id_usuario,
      fecha,
      hora,
      tipo,
      ubicacion,
      image_source,
      estado,
      observaciones,
      pred_distance
    } = props;
    navigate(`/actMarcacion/${id_marcacion}`, {
      state: {
        id_usuario,
        fecha,
        hora,
        tipo,
        ubicacion,
        image_source,
        estado,
        observaciones,
        pred_distance
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
  
  const handleDeleteConfirm = () => {
    const id = selectedRow.id_marcacion;
    axios
      .delete(`${apiUrl}/marcacion/${id}`)
      .then((response) => {
        const updatedRows = rows.filter((r) => r.id !== selectedRow.id);
        setRows(updatedRows);
        setSnackbarMessage("Marcación eliminada exitosamente.");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
      })
      .catch((error) => {
        console.error("Error al eliminar la Marcación:", error);
        setSnackbarMessage("Error al eliminar la Marcación.");
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
      field: "id_marcacion", 
      headerName: "ID", 
      flex: 0.5 
    },
    {
      field: "id_usuario",
      headerName: "ID Usuario",
      flex: 0.5,
      cellClassName: "name-column--cell",
    },
    {
      field: "fecha",
      headerName: "Fecha",
      flex: 1,
    },
    {
      field: "hora",
      headerName: "Hora",
      flex: 1,
    },
    {
      field: "tipo",
      headerName: "Tipo",
      flex: 1,
    },
    {
      field: "ubicacion",
      headerName: "Ubicación",
      flex: 1,
    },
    {
      field: "image_source",
      headerName: "Imagen de Marcación",
      flex: 1,
    },
    {
      field: "estado",
      headerName: "Estado",
      flex: 1,
    },
    {
      field: "observaciones",
      headerName: "Observaciones",
      flex: 1,
    },
    {
      field: "pred_distance",
      headerName: "Distancia de Predicción",
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
        title="MARCACIONES"
        subtitle="Lista de marcaciones realizadas por los usuarios, la imagen adjunta puede ser una dirección URL o una imagen en Base64"
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
          ¿Estás seguro de que deseas eliminar esta Marcación?
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

export default MarcacionInfo;
