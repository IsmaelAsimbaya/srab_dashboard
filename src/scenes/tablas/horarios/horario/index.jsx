import { Box, Button, TextField, Typography } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../../../components/Header";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Horario = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [apiResponse, setApiResponse] = useState(null);
  const [apiError, setApiError] = useState(null);
  const navigate = useNavigate(); 
  const apiUrl = process.env.REACT_APP_APP_HORARIOS_URL;

  const handleSubmitApi = async (values) => {
    try {
      const response = await axios.post(`${apiUrl}/horario`, values);
      setApiResponse(response.data);
      setApiError(null);
      alert("Se ha agregado el Lugar de Trabajo");
    } catch (error) {
      setApiResponse(null);
      setApiError(error.message || "Hubo un error al conectar con la API.");
    }
    navigate("/infoHorarios");
  };

  return (
    <Box m="20px">
      <Header
        title="CREAR HORARIO"
        subtitle="Establece un horario con horas de entrada y salida para los días especificados."
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
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Nombre"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.nombre}
                name="nombre"
                error={!!touched.nombre && !!errors.nombre}
                helperText={touched.nombre && errors.nombre}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Dias de la Semana"
                placeholder="Lunes, Martes, Miércoles ..."
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.diasSemana}
                name="diasSemana"
                error={!!touched.diasSemana && !!errors.diasSemana}
                helperText={touched.diasSemana && errors.diasSemana}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Hora de Entrada"
                placeholder="HH:MM:SS"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.horaEntrada}
                name="horaEntrada"
                error={!!touched.horaEntrada && !!errors.horaEntrada}
                helperText={touched.horaEntrada && errors.horaEntrada}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Hora de Salida"
                placeholder="HH:MM:SS"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.horaSalida}
                name="horaSalida"
                error={!!touched.horaSalida && !!errors.horaSalida}
                helperText={touched.horaSalida && errors.horaSalida}
                sx={{ gridColumn: "span 2" }}
              />
            </Box>
            <Box display="flex" justifyContent="end" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                Crear Horario
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
  horaEntrada: yup
    .string()
    .matches(timeRegExp, "El formato debe ser HH:MM:SS")
    .required("required"),
  horaSalida: yup
    .string()
    .matches(timeRegExp, "El formato debe ser HH:MM:SS")
    .required("required"),
  diasSemana: yup.string().required("required"),
  nombre: yup.string().required("required"),
});

const initialValues = {
  horaEntrada: "",
  horaSalida: "",
  diasSemana: "",
  nombre: "",
};

export default Horario;
