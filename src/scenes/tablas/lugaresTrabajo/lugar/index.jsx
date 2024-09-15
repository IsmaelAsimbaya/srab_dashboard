import { Box, Button, TextField, Typography } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../../../components/Header";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Lugar = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [apiResponse, setApiResponse] = useState(null);
  const [apiError, setApiError] = useState(null);
  const navigate = useNavigate(); 
  const apiUrl = window._env_.REACT_APP_APP_LUGARESTRABAJO_URL

  const handleSubmitApi = async (values) => {
    try {
      const response = await axios.post(`${apiUrl}/lugartrabajo`, values);
      setApiResponse(response.data);
      setApiError(null);
      alert("Se ha agregado el Lugar de Trabajo");
    } catch (error) {
      setApiResponse(null);
      setApiError(error.message || "Hubo un error al conectar con la API.");
    }
    navigate("/infoLugaresTrabajo");
  };

  return (
    <Box m="20px">
      <Header
        title="CREAR LUGAR DE TRABAJO"
        subtitle="Establece un lugar de trabajo con una coordenada de referencia y cuatro 
      ejes que representan el area (establecer los ejes desde el norte en sentido horario)."
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
                label="Nombre del Lugar"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.nombreLugar}
                name="nombreLugar"
                error={!!touched.nombreLugar && !!errors.nombreLugar}
                helperText={touched.nombreLugar && errors.nombreLugar}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Coordenadas"
                placeholder="Ej: x.xxxxxx, x.xxxxxx"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.cord}
                name="cord"
                error={!!touched.cord && !!errors.cord}
                helperText={touched.cord && errors.cord}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Dirección"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.direccionLugar}
                name="direccionLugar"
                error={!!touched.direccionLugar && !!errors.direccionLugar}
                helperText={touched.direccionLugar && errors.direccionLugar}
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Eje 1"
                placeholder="Ej: x.xxxxxx, x.xxxxxx"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.axis1}
                name="axis1"
                error={!!touched.axis1 && !!errors.axis1}
                helperText={touched.axis1 && errors.axis1}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Eje 2"
                placeholder="Ej: x.xxxxxx, x.xxxxxx"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.axis2}
                name="axis2"
                error={!!touched.axis2 && !!errors.axis2}
                helperText={touched.axis2 && errors.axis2}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Eje 3"
                placeholder="Ej: x.xxxxxx, x.xxxxxx"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.axis3}
                name="axis3"
                error={!!touched.axis3 && !!errors.axis3}
                helperText={touched.axis3 && errors.axis3}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Eje 4"
                placeholder="Ej: x.xxxxxx, x.xxxxxx"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.axis4}
                name="axis4"
                error={!!touched.axis4 && !!errors.axis4}
                helperText={touched.axis4 && errors.axis4}
                sx={{ gridColumn: "span 2" }}
              />
            </Box>
            <Box display="flex" justifyContent="end" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                Crear Lugar de Trabajo
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

const coordinateRegex = /^-?\d+(\.\d{6,}),\s-?\d+(\.\d{6,})$/;

const checkoutSchema = yup.object().shape({
  nombreLugar: yup.string().required("required"),
  direccionLugar: yup.string().required("required"),
  cord: yup
    .string()
    .matches(
      coordinateRegex,
      "Formato inválido, debe ser de la forma 0.000000, 0.000000 con al menos 6 dígitos decimales"
    )
    .required("required"),
  axis1: yup
    .string()
    .matches(
      coordinateRegex,
      "Formato inválido, debe ser de la forma 0.000000, 0.000000 con al menos 6 dígitos decimales"
    )
    .required("required"),
  axis2: yup
    .string()
    .matches(
      coordinateRegex,
      "Formato inválido, debe ser de la forma 0.000000, 0.000000 con al menos 6 dígitos decimales"
    )
    .required("required"),
  axis3: yup
    .string()
    .matches(
      coordinateRegex,
      "Formato inválido, debe ser de la forma 0.000000, 0.000000 con al menos 6 dígitos decimales"
    )
    .required("required"),
  axis4: yup
    .string()
    .matches(
      coordinateRegex,
      "Formato inválido, debe ser de la forma 0.000000, 0.000000 con al menos 6 dígitos decimales"
    )
    .required("required"),
});

const initialValues = {
  nombreLugar: "",
  direccionLugar: "",
  cord: "0.000000, 0.000000",
  axis1: "0.000000, 0.000000",
  axis2: "0.000000, 0.000000",
  axis3: "0.000000, 0.000000",
  axis4: "0.000000, 0.000000",
};

export default Lugar;