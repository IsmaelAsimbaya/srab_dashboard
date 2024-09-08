import { Box, Button, TextField, FormControl, InputLabel, Select, MenuItem, FormHelperText, Typography } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../../../components/Header";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Marcacion = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [apiResponse, setApiResponse] = useState(null);
  const [apiError, setApiError] = useState(null);
  const [usuarioOptions, setUsuarioOptions] = useState([]);
  const [lugarOptions, setlugarOptions] = useState([]);
  const navigate = useNavigate(); 
  const apiUrl = process.env.REACT_APP_APP_MARCACIONES_URL;
  const apiUsuariosUrl = process.env.REACT_APP_APP_USUARIOS_URL;
  const apiLugarUrl = process.env.REACT_APP_APP_LUGARESTRABAJO_URL;

  const handleSubmitApi = async (values) => {
    try {
      const response = await axios.post(`${apiUrl}/marcacion`, values);
      setApiResponse(response.data);
      setApiError(null);
      alert("Se ha agregado la Marcación");
    } catch (error) {
      setApiResponse(null);
      setApiError(error.message || "Hubo un error al conectar con la API.");
    }
    navigate("/infoMarcaciones");
  };

  const fetchUsuariosOptions = async () => {
    try {
      const response = await axios.get(`${apiUsuariosUrl}/usuario/raw`);
      const data = response.data;
      setUsuarioOptions(data);
    } catch (error) {
      console.error("Error fetching usuarios options:", error);
    }
  };

  const fetchLugaresOptions = async () => {
    try {
      const response = await axios.get(`${apiLugarUrl}/lugartrabajo`);
      const data = response.data;
      setlugarOptions(data);
    } catch (error) {
      console.error("Error fetching lugartrabajo options:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchUsuariosOptions();
      await fetchLugaresOptions();
    };

    fetchData();
  }, []);

  return (
    <Box m="20px">
      <Header
        title="CREAR MARCACIÓN"
        subtitle="Establece una marcación con sus respectivos datos. 
        Se recomienda utilizar este ingreso solo si la aplicación móvil 
        presenta algún fallo inesperado, ya que no realiza ninguna verificación 
        biometrica o de ubicación."
      />

      <Formik
        onSubmit={handleSubmitApi}
        initialValues={initialValues}
        validationSchema={checkoutSchema}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
        }) => (
          <form onSubmit={handleSubmit}>
            <Box
              display="grid"
              gap="30px"
              gridTemplateColumns="repeat(4, minmax(0, 1fr))"
              sx={{
                "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
              }}
            >
              <FormControl
                fullWidth
                variant="filled"
                sx={{ gridColumn: "span 2" }}
                error={!!touched.id_usuario && !!errors.id_usuario}
              >
                <InputLabel htmlFor="id_usuario-select" sx={{ fontSize: 14 }}>
                  ID Usuario
                </InputLabel>
                <Select
                  value={values.id_usuario}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  name="id_usuario"
                  displayEmpty
                  inputProps={{
                    name: "id_usuario",
                    id: "id_usuario-select",
                  }}
                >
                  <MenuItem value="" disabled>
                    Seleccionar ID Usuario
                  </MenuItem>
                  {usuarioOptions.map((user) => (
                    <MenuItem key={user.id_usuario} value={user.id_usuario}>
                      {user.id_usuario} - {user.nombres} {user.apellidos}
                    </MenuItem>
                  ))}
                </Select>
                {touched.id_usuario && errors.id_usuario && (
                  <FormHelperText>{errors.id_usuario}</FormHelperText>
                )}
              </FormControl>
              <TextField
                fullWidth
                variant="filled"
                type="date"
                label="Fecha"
                placeholder="YYYY-MM-DD"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.fecha}
                name="fecha"
                error={!!touched.fecha && !!errors.fecha}
                helperText={touched.fecha && errors.fecha}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Hora"
                placeholder="HH:MM:SS"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.hora}
                name="hora"
                error={!!touched.hora && !!errors.hora}
                helperText={touched.hora && errors.hora}
                sx={{ gridColumn: "span 2" }}
              />
              <FormControl
                fullWidth
                variant="filled"
                sx={{ gridColumn: "span 2" }}
                error={!!touched.tipo && !!errors.tipo}
              >
                <InputLabel htmlFor="tipo-select" sx={{ fontSize: 14 }}>
                  Tipo
                </InputLabel>
                <Select
                  value={values.tipo}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  name="tipo"
                  displayEmpty
                  inputProps={{
                    name: "tipo",
                    id: "tipo-select",
                  }}
                >
                  <MenuItem value="" disabled>
                    Tipo de Marcación
                  </MenuItem>
                  <MenuItem value="entrada">Entrada</MenuItem>
                  <MenuItem value="salida">Salida</MenuItem>
                </Select>
                {touched.tipo && errors.tipo && (
                  <FormHelperText>{errors.tipo}</FormHelperText>
                )}
              </FormControl>
              <FormControl
                fullWidth
                variant="filled"
                sx={{ gridColumn: "span 4" }}
                error={!!touched.ubicacion && !!errors.ubicacion}
              >
                <InputLabel htmlFor="ubicacion-select" sx={{ fontSize: 14 }}>
                  Ubicación
                </InputLabel>
                <Select
                  value={values.ubicacion}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  name="ubicacion"
                  displayEmpty
                  inputProps={{
                    name: "ubicacion",
                    id: "ubicacion-select",
                  }}
                >
                  <MenuItem value="" disabled>
                    Seleccionar Lugar Trabajo
                  </MenuItem>
                  {lugarOptions.map((lugar) => (
                    <MenuItem
                      key={lugar.id_lugar}
                      value={`${lugar.nombreLugar} - ${lugar.direccionLugar}`}
                    >
                      {lugar.id_lugar} : {lugar.nombreLugar} -{" "}
                      {lugar.direccionLugar}
                    </MenuItem>
                  ))}
                </Select>
                {touched.ubicacion && errors.ubicacion && (
                  <FormHelperText>{errors.ubicacion}</FormHelperText>
                )}
              </FormControl>
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Imagen de Marcación"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.image_source}
                name="image_source"
                error={!!touched.image_source && !!errors.image_source}
                helperText={touched.image_source && errors.image_source}
                sx={{ gridColumn: "span 4" }}
              />
            </Box>
            <Box display="flex" justifyContent="end" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                Crear Marcación
              </Button>
            </Box>
          </form>
        )}
      </Formik>
      {apiResponse && (
        <Box mt={2}>
          <Typography variant="subtitle1">API Response:</Typography>
          <pre>{JSON.stringify(apiResponse, null, 2)}</pre>
        </Box>
      )}
      {apiError && (
        <Box mt={2}>
          <Typography variant="subtitle1" color="error">
            API Error: {apiError}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

const timeRegExp = /^([0-1]\d|2[0-3]):([0-5]\d):([0-5]\d)$/;

const checkoutSchema = yup.object().shape({
  id_usuario: yup
    .number()
    .required("required")
    .moreThan(0, "El id_usuario no puede ser 0, elija un valor valido"),
  fecha: yup.date().required("required"),
  hora: yup
    .string()
    .matches(timeRegExp, "El formato debe ser HH:MM:SS")
    .required("required"),
  tipo: yup.string().required("required"),
  ubicacion: yup.string().required("required"),
  image_source: yup.string().required("required"),
});
const initialValues = {
  id_usuario: 0,
  fecha: "",
  hora: "",
  tipo: "",
  ubicacion: "",
  image_source: "",
};

export default Marcacion;