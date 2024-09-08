import { Box, Button, TextField, FormControl, InputLabel, Select, MenuItem, FormHelperText, Typography } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../../../components/Header";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Face = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [apiResponse, setApiResponse] = useState(null);
  const [apiError, setApiError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [train, setTrain] = useState(false);

  const [usuarioOptions, setUsuarioOptions] = useState([]);
  const [faceOptions, setFaceOptions] = useState([]);
  const [loginOptions, setLoginOptions] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  
  const navigate = useNavigate();
  const apiUrl = process.env.REACT_APP_APP_PYAUTENBIO;
  const apiUsuariosUrl = process.env.REACT_APP_APP_USUARIOS_URL;
  const apiLoginsUrl = process.env.REACT_APP_APP_LOGINS_URL;

  const fetchUsuariosOptions = async () => {
    try {
      const response = await axios.get(`${apiUsuariosUrl}/usuario/raw`);
      const data = response.data;
      setUsuarioOptions(data);
    } catch (error) {
      console.error("Error fetching usuarios options:", error);
    }
  };

  const fetchFaceOptions = async () => {
    try {
      const response = await axios.get(`${apiUrl}/get_all_training_status/`);
      const data = response.data;
      setFaceOptions(data);
    } catch (error) {
      console.error("Error fetching faces options:", error);
    }
  };

  const fetchLoginOptions = async () => {
    try {
      const response = await axios.get(`${apiLoginsUrl}/login/is_active/true`);
      const data = response.data;
      setLoginOptions(data);
    } catch (error) {
      console.error("Error fetching faces options:", error);
    }
  };

  const filterData = (loginsData, faceData, usuariosData) => {
    let filteredLogins;
    if (faceData.length === 0) {
      filteredLogins = loginsData;
    } else {
        filteredLogins = loginsData.filter(
          (login) =>
            login.is_active === true &&
            !faceData.some((face) => face.id === login.username)
        );
    }
    const combinedData = filteredLogins.map((login) => {
      const usuario = usuariosData.find(
        (user) => user.id_usuario === login.id_usuario
      );
      return {
        persona_id: login.username,
        video_url: usuario?.face_source_url || "",
      };
    });
    return combinedData;
  };
  
  useEffect(() => {
    const fetchData = async () => {
      await fetchUsuariosOptions();
      await fetchFaceOptions();
      await fetchLoginOptions();
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (
      usuarioOptions.length > 0 &&
      loginOptions.length > 0
    ) {
      const result = filterData(loginOptions, faceOptions, usuarioOptions);
      setFilteredData(result);
    }
  }, [usuarioOptions, loginOptions, faceOptions]); 

  const handleSubmitCapturador = async (values) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${apiUrl}/capturar_rostros_video/`,
        values,
        {
          headers: {
            "Content-Type": "application/json",
          },
          timeout: 100000,
          timeoutErrorMessage:
            "La solicitud ha tardado demasiado tiempo en completarse.",
        }
      );
      setApiResponse(response.data);
      setApiError(null);
      alert("Se ha capturado el rostro exitosamente");
    } catch (error) {
      setApiResponse(null);
      setApiError(error.message || "Hubo un error al conectar con la API.");
    } finally {
      setLoading(false);
    }
    navigate("/infoFace");
  };
  
  const handleSubmitEntrenador = async () => {
    setTrain(true);
    try {
      const values = {
        data_path: "/work/data/train",
        model_save_path: "/work/knn_modelo_entrenado.clf",
        n_vecinos: 5,
      };
      const response = await axios.post(`${apiUrl}/entrenar_knn/`, values);
      setApiResponse(response.data);
      setApiError(null);
      alert("Se ha entrenado el modelo exitosamente");
    } catch (error) {
      setApiResponse(null);
      setApiError(error.message || "Hubo un error al conectar con la API.");
    } finally {
        setTrain(false);
    }
  };

  return (
    <Box m="20px">
      <Header
        title="RECONOCIMIENTO FACIAL"
        subtitle="Permite realizar la codificación de rostros para los usuarios disponibles
        que cumplan la condición de tener registrado un login activo. Tenga en cuenta que 
        la captura llega a durar entre 30 y 45 segundos."
      />

      <Formik
        initialValues={initialValues}
        validationSchema={checkoutSchema}
        onSubmit={handleSubmitCapturador}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          setFieldValue,
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
                error={!!touched.persona_id && !!errors.persona_id}
              >
                <InputLabel htmlFor="persona_id-select" sx={{ fontSize: 14 }}>
                  Persona ID
                </InputLabel>
                <Select
                  value={values.persona_id}
                  onChange={(event) => {
                    const selectedPersonaId = event.target.value;
                    const selectedData = filteredData.find(
                      (data) => data.persona_id === selectedPersonaId
                    );
                    setFieldValue("persona_id", selectedPersonaId);
                    setFieldValue("video_url", selectedData?.video_url || "");
                  }}
                  onBlur={handleBlur}
                  name="persona_id"
                  displayEmpty
                  inputProps={{
                    name: "persona_id",
                    id: "persona_id-select",
                  }}
                >
                  <MenuItem value="" disabled>
                    Seleccionar Persona ID
                  </MenuItem>
                  {filteredData.map((data) => (
                    <MenuItem key={data.persona_id} value={data.persona_id}>
                      {data.persona_id}
                    </MenuItem>
                  ))}
                </Select>
                {touched.persona_id && errors.persona_id && (
                  <FormHelperText>{errors.persona_id}</FormHelperText>
                )}
              </FormControl>

              <FormControl
                fullWidth
                variant="filled"
                sx={{ gridColumn: "span 4" }}
                error={!!touched.video_url && !!errors.video_url}
              >
                <InputLabel htmlFor="video_url" sx={{ fontSize: 14 }}>
                  Video URL
                </InputLabel>
                <TextField
                  value={values.video_url}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  name="video_url"
                  inputProps={{
                    name: "video_url",
                    id: "video_url",
                  }}
                  disabled
                />
                {touched.video_url && errors.video_url && (
                  <FormHelperText>{errors.video_url}</FormHelperText>
                )}
              </FormControl>
            </Box>
            <Box display="flex" justifyContent="end" mt="20px">
              <Button
                type="submit"
                color="secondary"
                variant="contained"
                disabled={loading}
              >
                {loading ? "Capturando..." : "Capturar Rostro"}
              </Button>
            </Box>
            {loading && <p>La captura de rostros ha comenzado...</p>}
            <Box display="flex" justifyContent="end" mt="20px">
              <Button
                color="secondary"
                variant="contained"
                disabled={train}
                onClick={handleSubmitEntrenador}
              >
                {train ? "Entrenando..." : "Entrenar Modelo"}
              </Button>
            </Box>
            {train && <p>El entrenamiento ha comenzado...</p>}
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
  persona_id: yup.string().required("required"),
  video_url: yup.string().required("required")
});

const initialValues = {
  persona_id: "",
  video_url: ""
};

export default Face;