import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Axios from "axios";
import WaitAction from "../../components/UI/WaitAction";

// MUI imports
import {
  Button,
  Paper,
  Stack,
  InputAdornment,
  FormControl,
  OutlinedInput,
  InputLabel,
  Typography,
  Box
} from "@mui/material";

import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Visibility from "@mui/icons-material/Visibility";
import IconButton from "@mui/material/IconButton";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

// Imagem
import logoIcon from '../../assets/admsom.png'

export default function Login() {
  const navigate = useNavigate();

  const [values, setValues] = useState({
    username: "",
    password: "",
  });
  const [posted, setPosted] = useState(false);
  const [erro, setErro] = useState({
    status: false,
    mensagem: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  function onSubmit(values) {
    setPosted(true);

    Axios({
      method: "POST",
      data: values,
      withCredentials: true,
      url: `${process.env.REACT_APP_BACK_SERVER_LOCATION}/api/users/login`,
    })
      .then(() => {
        navigate("/");
        window.location.reload();
      })
      .catch((err) => {
        console.warn("Erro de login:", err);
        setErro({
          status: true,
          mensagem: err.response?.data?.mensagem || "Erro desconhecido",
        });
      });
  }

  return (
    <>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <Paper
          elevation={3}
          sx={{
            width: "100%",
            minWidth: 700,
            padding: 4,
            borderRadius: 4,
            textAlign: "center",
          }}
        >
          <img
            src={logoIcon}
            alt="Logo Admsom"
            style={{
              width: "120px",
              marginBottom: 24,
              objectFit: "contain"
            }}
          />

          <Typography variant="h6" fontWeight="bold" mb={3}>
            Acesse sua conta
          </Typography>

          <Stack spacing={2}>
            <FormControl fullWidth variant="outlined">
              <InputLabel htmlFor="username">Usuário</InputLabel>
              <OutlinedInput
                name="username"
                id="username"
                type="text"
                label="Usuário"
                required
                value={values.username}
                onChange={(e) =>
                  setValues({ ...values, username: e.target.value })
                }
                endAdornment={
                  <InputAdornment position="end">
                    <AccountCircleIcon />
                  </InputAdornment>
                }
              />
            </FormControl>

            <FormControl fullWidth variant="outlined">
              <InputLabel htmlFor="password">Senha</InputLabel>
              <OutlinedInput
                name="password"
                id="password"
                type={showPassword ? "text" : "password"}
                label="Senha"
                required
                value={values.password}
                onChange={(e) =>
                  setValues({ ...values, password: e.target.value })
                }
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>

            <Button
              variant="contained"
              fullWidth
              sx={{ paddingY: 1 }}
              onClick={() => onSubmit(values)}
            >
              Entrar
            </Button>
          </Stack>
        </Paper>
      </Box>

      {posted && (
        <WaitAction
          erro={erro.status}
          ErrMsg={erro.mensagem}
          onClose={() => {
            setPosted(false);
            setErro({ status: false, mensagem: "" });
          }}
        />
      )}
    </>
  );
}
