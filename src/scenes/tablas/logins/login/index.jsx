import {
  Box,
  Button,
  TextField,
  FormControl,
  Select,
  MenuItem,
  FormHelperText,
  Typography,
  InputLabel,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../../../components/Header";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [apiResponse, setApiResponse] = useState(null);
  const [apiError, setApiError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const [usuarioOptions, setUsuarioOptions] = useState([]);
  const [filteredUsuarioOptions, setFilteredUsuarioOptions] = useState([]);
  const [usernameOptions, setUsernameOptions] = useState([]);
  const [usernameError, setUsernameError] = useState("");

  const navigate = useNavigate();
  const apiUrl = window._env_.REACT_APP_APP_LOGINS_URL;
  const apiUsuariosUrl = window._env_.REACT_APP_APP_USUARIOS_URL;

  const handleSubmitApi = async (values) => {
    try {
      const response = await axios.post(`${apiUrl}/login`, values);
      setApiResponse(response.data);
      setApiError(null);
      alert("Se ha agregado el Login");
    } catch (error) {
      setApiResponse(null);
      setApiError(error.message || "Hubo un error al conectar con la API.");
    }
    navigate("/infoLogins");
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

  const filterUsuarios = (usuariosData, loginsData) => {
    return usuariosData.filter(usuario => {
      return !loginsData.some(login => login.id_usuario === usuario.id_usuario);
    });
  };

  const fetchUsernameOptions = async () => {
    try {
      const response = await axios.get(`${apiUrl}/login`);
      const data = response.data;
      setUsernameOptions(data);
    } catch (error) {
      console.error("Error fetching username options:", error);
    }
  };

  const handleUsernameChange = (event, handleChange) => {
    const { value } = event.target;
    const isUsernameTaken = usernameOptions.some(
      (option) => option.username.toLowerCase() === value.toLowerCase()
    );
    if (isUsernameTaken) {
      setUsernameError("Este username ya está en uso.");
    } else {
      setUsernameError("");
    }
    handleChange(event);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchUsuariosOptions();
      await fetchUsernameOptions();
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (usuarioOptions.length > 0 && usernameOptions.length > 0) {
      const filteredUsuarios = filterUsuarios(usuarioOptions, usernameOptions);
      setFilteredUsuarioOptions(filteredUsuarios);
    }
  }, [usuarioOptions, usernameOptions]);

  return (
    <Box m="20px">
      <Header
        title="CREAR LOGIN"
        subtitle="Establece las credenciales para un login asignado a un usuario.
        Tomar en cuenta que el campo de username es único y que el campo de password 
        no se guardara como tal en la Base de Datos."
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
                  {filteredUsuarioOptions.map((user) => (
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
                type="text"
                label="Rol"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.roles}
                name="roles"
                error={!!touched.roles && !!errors.roles}
                helperText={touched.roles && errors.roles}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Username"
                onBlur={handleBlur}
                onChange={(event) => handleUsernameChange(event, handleChange)}
                value={values.username}
                name="username"
                error={
                  !!touched.username && (!!errors.username || !!usernameError)
                }
                helperText={
                  touched.username && (errors.username || usernameError)
                }
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type={showPassword ? "text" : "password"}
                label="Password"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.password}
                name="password"
                error={!!touched.password && !!errors.password}
                helperText={touched.password && errors.password}
                sx={{ gridColumn: "span 2" }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={togglePasswordVisibility}
                        onMouseDown={(event) => event.preventDefault()}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <FormControl
                fullWidth
                variant="filled"
                sx={{ gridColumn: "span 2" }}
                error={!!touched.is_active && !!errors.is_active}
              >
                <InputLabel htmlFor="is_active-select" sx={{ fontSize: 14 }}>
                  Estado Activo
                </InputLabel>
                <Select
                  value={values.is_active}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  name="is_active"
                  displayEmpty
                  inputProps={{
                    name: "is_active",
                    id: "is_active-select",
                  }}
                >
                  <MenuItem value="" disabled>
                    Estado
                  </MenuItem>
                  <MenuItem value="true">Activo</MenuItem>
                  <MenuItem value="false">Inactivo</MenuItem>
                </Select>
                {touched.is_active && errors.is_active && (
                  <FormHelperText>{errors.is_active}</FormHelperText>
                )}
              </FormControl>
            </Box>
            <Box display="flex" justifyContent="end" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                Crear Login
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
  id_usuario: yup
    .number()
    .required("required")
    .moreThan(0, "El id_usuario no puede ser 0, elija un valor valido"),
  username: yup.string().required("required"),
  password: yup
    .string()
    .required("required")
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .matches(/[a-z]/, "La contraseña debe contener al menos una letra minúscula")
    .matches(/[A-Z]/, "La contraseña debe contener al menos una letra mayúscula")
    .matches(/[0-9]/, "La contraseña debe contener al menos un número")
    .matches(/[@$!%*?&#]/, "La contraseña debe contener al menos un símbolo especial"),
  roles: yup.string().required("required"),
  is_active: yup.boolean().required("required"),
});

const initialValues = {
  id_usuario: 0,
  username: "",
  password: "",
  roles: "",
  is_active: null,
};

export default Login;
