import { Box, Button, TextField, FormControl, Select, MenuItem, FormHelperText, Typography, InputLabel, LinearProgress } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../../../components/Header";
import { useState , useEffect} from "react";
import axios from "axios";
import { useParams, useLocation, useNavigate  } from "react-router-dom";
import { uploadVideoToFirebase } from "/app/src/services/firebaseService";

const ActUsuario = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [apiResponse] = useState(null);
  const [apiError] = useState(null);
  const [rows, setRows] = useState([]);
  const [lugarOptions, setlugarOptions] = useState([]);
  const [horarioOptions, sethorarioOptions] = useState([]);

  const [videoFile, setVideoFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const navigate = useNavigate(); 
  const apiUrl = process.env.REACT_APP_APP_USUARIOS_URL;
  const apiLugarUrl = process.env.REACT_APP_APP_LUGARESTRABAJO_URL;
  const apiHorarioUrl = process.env.REACT_APP_APP_HORARIOS_URL;

  const { id_usuario } = useParams();
  const location = useLocation();
  const {
    ci,
    nombres,
    apellidos,
    fecha_nacimiento,
    email,
    face_source_url,
    telefono_movil,
    telefono_fijo,
    direccion,
    id_lugar,
    id_horario,
  } = location.state || {};

  const initialValues = {
    ci: ci,
    nombres: nombres,
    apellidos: apellidos,
    fecha_nacimiento: fecha_nacimiento,
    email: email,
    face_source_url: face_source_url,
    telefono_movil: telefono_movil,
    telefono_fijo: telefono_fijo,
    direccion: direccion,
    id_lugar: id_lugar,
    id_horario: id_horario,
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

  const fetchHorariosOptions = async () => {
    try {
      const response = await axios.get(`${apiHorarioUrl}/horario`);
      const data = response.data;
      sethorarioOptions(data);
    } catch (error) {
      console.error("Error fetching horarios options:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchLugaresOptions();
      await fetchHorariosOptions();
    };

    fetchData();
  }, []);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setVideoFile(file);
    } else {
      alert("Por favor selecciona un archivo de video.");
    }
  };

  const handleUpdate = async (row) => {
    const updatedData = {
      ci: row.ci,
      nombres: row.nombres,
      apellidos: row.apellidos,
      fecha_nacimiento: row.fecha_nacimiento,
      email: row.email,
      face_source_url: row.face_source_url,
      telefono_movil: row.telefono_movil,
      telefono_fijo: row.telefono_fijo,
      direccion: row.direccion,
      id_lugar: row.id_lugar,
      id_horario: row.id_horario,
    };
    try {
      if (videoFile) {
        const videoURL = await uploadVideoToFirebase(videoFile, setUploadProgress); 
        face_source_url = videoURL;
      }
      await axios.put(`${apiUrl}/usuario/${id_usuario}`, updatedData);
      const updatedRows = rows.map((r) => {
        if (r.id === row.id) {
          return { ...r};
        }
        return r;
      });
      setRows(updatedRows);
      alert("Se ha modificado los datos de Usuario");
    }
    catch (error) {
      console.error("Error al obtener datos de Usuario:", error);
      alert("No se pudieron modificar los datos de Usuario");
    };
    row.ci = "";
    row.nombres = "";
    row.apellidos = "";
    row.fecha_nacimiento = "";
    row.email = "";
    row.face_source_url = "";
    row.telefono_movil = "";
    row.telefono_fijo = "";
    row.direccion = "";
    row.id_lugar = 0;
    row.id_horario = 0;

    navigate("/infoUsuarios");
  };


  return (
    <Box m="20px">
      <Header
        title="ACTUALIZAR USUARIO"
        subtitle="Actualiza los datos de un Usuario.
        Asegúrese de elegir un archivo de video valido para
        el entrenamiento de reconocimiento facial."
      />

      <Formik
        onSubmit={handleUpdate}
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
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="CI"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.ci}
                name="ci"
                error={!!touched.ci && !!errors.ci}
                helperText={touched.ci && errors.ci}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="date"
                label="Fecha de Nacimiento"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.fecha_nacimiento}
                name="fecha_nacimiento"
                error={!!touched.fecha_nacimiento && !!errors.fecha_nacimiento}
                helperText={touched.fecha_nacimiento && errors.fecha_nacimiento}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Nombres"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.nombres}
                name="nombres"
                error={!!touched.nombres && !!errors.nombres}
                helperText={touched.nombres && errors.nombres}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Apellidos"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.apellidos}
                name="apellidos"
                error={!!touched.apellidos && !!errors.apellidos}
                helperText={touched.apellidos && errors.apellidos}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="email"
                label="Email"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.email}
                name="email"
                error={!!touched.email && !!errors.email}
                helperText={touched.email && errors.email}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Dirección"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.direccion}
                name="direccion"
                error={!!touched.direccion && !!errors.direccion}
                helperText={touched.direccion && errors.direccion}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="tel"
                label="Teléfono Movil"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.telefono_movil}
                name="telefono_movil"
                error={!!touched.telefono_movil && !!errors.telefono_movil}
                helperText={touched.telefono_movil && errors.telefono_movil}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="tel"
                label="Teléfono Fijo"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.telefono_fijo}
                name="telefono_fijo"
                error={!!touched.telefono_fijo && !!errors.telefono_fijo}
                helperText={touched.telefono_fijo && errors.telefono_fijo}
                sx={{ gridColumn: "span 2" }}
              />
              <FormControl
                fullWidth
                variant="filled"
                sx={{ gridColumn: "span 2" }}
                error={!!touched.id_lugar && !!errors.id_lugar}
              >
                <InputLabel htmlFor="id_lugar-select" sx={{ fontSize: 14 }}>
                  Lugar de Trabajo
                </InputLabel>
                <Select
                  value={values.id_lugar}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  name="id_lugar"
                  displayEmpty
                  inputProps={{
                    name: "id_lugar",
                    id: "id_lugar-select",
                  }}
                >
                  <MenuItem value="" disabled>
                    Seleccionar Lugar Trabajo
                  </MenuItem>
                  {lugarOptions.map((lugar) => (
                    <MenuItem key={lugar.id_lugar} value={lugar.id_lugar}>
                      {lugar.id_lugar} : {lugar.nombreLugar} -{" "}
                      {lugar.direccionLugar}
                    </MenuItem>
                  ))}
                </Select>
                {touched.id_lugar && errors.id_lugar && (
                  <FormHelperText>{errors.id_lugar}</FormHelperText>
                )}
              </FormControl>
              <FormControl
                fullWidth
                variant="filled"
                sx={{ gridColumn: "span 2" }}
                error={!!touched.id_horario && !!errors.id_horario}
              >
                <InputLabel htmlFor="id_horario-select" sx={{ fontSize: 14 }}>
                  Horario
                </InputLabel>
                <Select
                  value={values.id_horario}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  name="id_horario"
                  displayEmpty
                  inputProps={{
                    name: "id_horario",
                    id: "id_horario-select",
                  }}
                >
                  <MenuItem value="" disabled>
                    Seleccionar Horario
                  </MenuItem>
                  {horarioOptions.map((horario) => (
                    <MenuItem
                      key={horario.id_horario}
                      value={horario.id_horario}
                    >
                      {horario.id_horario} {horario.nombre} :{" "}
                      {horario.horaEntrada} - {horario.horaSalida}
                    </MenuItem>
                  ))}
                </Select>
                {touched.id_horario && errors.id_horario && (
                  <FormHelperText>{errors.id_luid_horariogar}</FormHelperText>
                )}
              </FormControl>
              <FormControl
                fullWidth
                variant="filled"
                sx={{ gridColumn: "span 4" }}
                error={!!touched.video && !!errors.video}
              >
                <TextField
                  fullWidth
                  variant="filled"
                  type="file"
                  label="Cargar Video de Reconocimiento Facial"
                  InputLabelProps={{ shrink: true }}
                  onBlur={handleBlur}
                  onChange={handleFileChange}
                  name="video"
                  error={!!touched.video && !!errors.video}
                  helperText={touched.video && errors.video}
                />
                {uploadProgress > 0 && (
                  <Box sx={{ width: '100%', mt: 1 }}>
                    <Typography variant="body2">Progreso de subida: {uploadProgress}%</Typography>
                    <LinearProgress variant="determinate" value={uploadProgress} />
                  </Box>
                )}
              </FormControl>
            </Box>
            <Box display="flex" justifyContent="end" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                Actualizar Usuario
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

const checkoutSchema = yup.object().shape({
  ci: yup
    .string()
    .matches(/^\d{7,10}$/, "CI debe contener entre 7 y 10 dígitos")
    .required("El CI es obligatorio"),
  nombres: yup
    .string()
    .min(2, "El nombre debe contener al menos 2 caracteres")
    .required("El nombre es obligatorio"),
  apellidos: yup
    .string()
    .min(2, "El apellido debe contener al menos 2 caracteres")
    .required("El apellido es obligatorio"),
  fecha_nacimiento: yup
    .date()
    .max(new Date(), "La fecha de nacimiento no puede ser en el futuro")
    .required("La fecha de nacimiento es obligatoria"),
  email: yup
    .string()
    .email("Debe ser un email válido")
    .required("El email es obligatorio"),
  face_source_url: yup
    .string()
    .url("Debe ser una URL válida")
    .required("La URL es obligatoria"),
  telefono_movil: yup
    .string()
    .matches(/^\+?\d{7,15}$/, "Debe ser un número de teléfono válido")
    .required("El teléfono móvil es obligatorio"),
  telefono_fijo: yup
    .string()
    .matches(/^\d{6,10}$/, "Debe ser un número de teléfono fijo válido")
    .required("El teléfono fijo es obligatorio"),
  direccion: yup
    .string()
    .min(5, "La dirección debe contener al menos 5 caracteres")
    .required("La dirección es obligatoria"),
  id_lugar: yup
    .number()
    .required("required")
    .moreThan(0, "El id_lugar no puede ser 0, elija un valor valido"),
  id_horario: yup
    .number()
    .required("required")
    .moreThan(0, "El id_horario no puede ser 0, elija un valor valido"),
});

export default ActUsuario;
