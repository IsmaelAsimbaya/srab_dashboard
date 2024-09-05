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
  const apiUrl = process.env.REACT_APP_APP_LUGARESTRABAJO_URL

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
                placeholder="Ej: [0.244452° S, 78.505615° W]"
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
                placeholder="Ej: [0.244452° S, 78.505615° W]"
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
                placeholder="Ej: [0.244452° S, 78.505615° W]"
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
                placeholder="Ej: [0.244452° S, 78.505615° W]"
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
                placeholder="Ej: [0.244452° S, 78.505615° W]"
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

const checkoutSchema = yup.object().shape({
  nombreLugar: yup.string().required("required"),
  direccionLugar: yup.string().required("required"),
  cord: yup.string().required("required"),
  axis1: yup.string().required("required"),
  axis2: yup.string().required("required"),
  axis3: yup.string().required("required"),
  axis4: yup.string().required("required"),
});

const initialValues = {
  nombreLugar: "",
  direccionLugar: "",
  cord: "",
  axis1: "",
  axis2: "",
  axis3: "",
  axis4: "",
};

export default Lugar;