import { Box, Button, TextField, Typography } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../../../components/Header";
import { useState } from "react";
import axios from "axios";
import { useParams, useLocation, useNavigate} from "react-router-dom";

const ActLugar = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [apiResponse] = useState(null);
  const [apiError] = useState(null);
  const [rows, setRows] = useState([]);
  const navigate = useNavigate(); 
  const apiUrl = window._env_.REACT_APP_APP_LUGARESTRABAJO_URL

  const { id_lugar } = useParams();
  const location = useLocation();
  const {
    nombreLugar,
    direccionLugar,
    cord,
    axis1,
    axis2,
    axis3,
    axis4,
  } = location.state || {};

  const initialValues = {
    nombreLugar:nombreLugar,
    direccionLugar:direccionLugar,
    cord:cord,
    axis1:axis1,
    axis2:axis2,
    axis3:axis3,
    axis4:axis4,
  };

  const handleUpdate = async (row) => {
    const updatedData = {
      nombreLugar: row.nombreLugar,
      direccionLugar: row.direccionLugar,
      cord: row.cord,
      axis1: row.axis1,
      axis2: row.axis2,
      axis3: row.axis3,
      axis4: row.axis4,
    };
    try {
      await axios.put(`${apiUrl}/lugartrabajo/${id_lugar}`, updatedData);
      const updatedRows = rows.map((r) => {
        if (r.id === row.id) {
          return { ...r};
        }
        return r;
      });
      setRows(updatedRows);
      alert("Se ha modificado los datos del Lugar");
    }
    catch (error) {
      console.error("Error al obtener datos del Lugar:", error);
      alert("No se pudieron modificar los datos del Lugar");
    };

    row.nombreLugar = "";
    row.direccionLugar = "";
    row.cord = "";
    row.axis1 = "";
    row.axis2 = "";
    row.axis3 = "";
    row.axis4 = "";

    navigate("/infoLugaresTrabajo");
  };

  return (
    <Box m="20px">
      <Header
        title="ACTUALIZAR LUGAR DE TRABAJO"
        subtitle="Actualizar lugar de trabajo, tome en cuenta que se establece una coordenada de referencia y cuatro 
      ejes que representan el area (establecer los ejes desde el norte en sentido horario)."
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
                Actualizar Lugar de Trabajo
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

export default ActLugar;