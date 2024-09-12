import { Box, Button, TextField, Typography} from "@mui/material";
import { Formik, FieldArray } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../../../components/Header";
import { useState } from "react";
import axios from "axios";
import { useParams, useLocation, useNavigate } from "react-router-dom";

const ActHorario = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [apiResponse] = useState(null);
  const [apiError] = useState(null);
  const [rows, setRows] = useState([]);
  const navigate = useNavigate(); 
  const apiUrl = window._env_.REACT_APP_APP_HORARIOS_URL;

  const { id_horario } = useParams();
  const location = useLocation();
  const {
    diasHorario = [],
    nombre
  } = location.state || {};

  const initialValues = {
    nombre: nombre || "",
    diasHorario: diasHorario.length > 0 ? diasHorario : [{ diaSemana: "", horaEntrada: "", horaSalida: "" }],
  };

  const handleUpdate = async (row) => {
    const updatedData = {
      diasHorario: row.diasHorario,
      nombre: row.nombre,
    };
    try {
      await axios.put(`${apiUrl}/horario/${id_horario}`, updatedData);
      const updatedRows = rows.map((r) => {
        if (r.id === row.id) {
          return { ...r};
        }
        return r;
      });
      setRows(updatedRows);
      alert("Se ha modificado los datos del Horario");
    }
    catch (error) {
      console.error("Error al obtener datos del Horario:", error);
      alert("No se pudieron modificar los datos del Horario");
    };

    row.diasHorario = [];
    row.nombre = "";

    navigate("/infoHorarios");
  };

  return (
    <Box m="20px">
      <Header
        title="ACTUALIZAR HORARIO"
        subtitle="Actualizar datos de un horario establecido."
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
                label="Nombre"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.nombre}
                name="nombre"
                error={!!touched.nombre && !!errors.nombre}
                helperText={touched.nombre && errors.nombre}
                sx={{ gridColumn: "span 2" }}
              />
              <FieldArray name="diasHorario">
                {({ push, remove }) => (
                  <>
                    {values.diasHorario.map((dia, index) => (
                      <Box
                        key={index}
                        display="grid"
                        gap="30px"
                        gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                        sx={{ "& > div": { gridColumn: "span 2" } }}
                      >
                        <TextField
                          fullWidth
                          variant="filled"
                          type="text"
                          label="Día de la Semana"
                          placeholder="Lunes, Martes..."
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={dia.diaSemana}
                          name={`diasHorario.${index}.diaSemana`}
                          error={
                            !!touched.diasHorario?.[index]?.diaSemana &&
                            !!errors.diasHorario?.[index]?.diaSemana
                          }
                          helperText={
                            touched.diasHorario?.[index]?.diaSemana &&
                            errors.diasHorario?.[index]?.diaSemana
                          }
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
                          value={dia.horaEntrada}
                          name={`diasHorario.${index}.horaEntrada`}
                          error={
                            !!touched.diasHorario?.[index]?.horaEntrada &&
                            !!errors.diasHorario?.[index]?.horaEntrada
                          }
                          helperText={
                            touched.diasHorario?.[index]?.horaEntrada &&
                            errors.diasHorario?.[index]?.horaEntrada
                          }
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
                          value={dia.horaSalida}
                          name={`diasHorario.${index}.horaSalida`}
                          error={
                            !!touched.diasHorario?.[index]?.horaSalida &&
                            !!errors.diasHorario?.[index]?.horaSalida
                          }
                          helperText={
                            touched.diasHorario?.[index]?.horaSalida &&
                            errors.diasHorario?.[index]?.horaSalida
                          }
                          sx={{ gridColumn: "span 2" }}
                        />

                        {/* Botón para eliminar un día */}
                        <Button
                          type="button"
                          color="secondary"
                          variant="outlined"
                          onClick={() => remove(index)}
                        >
                          Eliminar Día
                        </Button>
                      </Box>
                    ))}
                    
                    {/* Botón para agregar un nuevo día */}
                    <Button
                      type="button"
                      color="primary"
                      variant="contained"
                      onClick={() => push({ diaSemana: "", horaEntrada: "", horaSalida: "" })}
                      sx={{ gridColumn: "span 4" }}
                    >
                      Agregar Día
                    </Button>
                  </>
                )}
              </FieldArray>
            </Box>
            <Box display="flex" justifyContent="end" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                Actualizar Horario
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

const diaSchema = yup.object().shape({
  diaSemana: yup.string().required("El día de la semana es requerido"),
  horaEntrada: yup
    .string()
    .matches(timeRegExp, "El formato debe ser HH:MM:SS")
    .required("La hora de entrada es requerida"),
  horaSalida: yup
    .string()
    .matches(timeRegExp, "El formato debe ser HH:MM:SS")
    .required("La hora de salida es requerida"),
});

const checkoutSchema = yup.object().shape({
  nombre: yup.string().required("El nombre es requerido"),
  diasHorario: yup.array().of(diaSchema).required("Debe haber al menos un día de horario"),
});

const initialValues = {
  nombre: "",
  diasHorario: [
    {
      diaSemana: "",
      horaEntrada: "",
      horaSalida: ""
    }
  ]
};

export default ActHorario;
