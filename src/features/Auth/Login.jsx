// React and NPM imports
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Axios from "axios";
import OnePageComponentSmall from "../Matriz/OnePageComponentSmall";
import WaitAction from "../../components/UI/WaitAction";

//Styling imports

//------- MUI cores
import { Button, Paper } from "@mui/material";
import Stack from "@mui/material/Stack";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";

//------- MUI icons
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Visibility from "@mui/icons-material/Visibility";
import IconButton from "@mui/material/IconButton";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

export default function Login(props) {
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
            .then((res) => {
                navigate("/");
                window.location.reload();
            })
            .catch((err) => {
                console.warn("Usuário não autenticado ou erro no servidor:", err);
                setErro({
                    status: true,
                    mensagem: err.response?.data?.mensagem || "Erro desconhecido",
                });
            });
    }
    return (
        <>
            <OnePageComponentSmall home ={false} backHome={true}>

                <Stack
                    id="login"
                    direction="column"
                    justifyContent="center"
                    alignItems={"center"}
                    width="100%"
                    spacing={5}
                >

                    <Paper

                        width="100%"
                        spacing={5}>
                        <br />
                        <FormControl sx={{ width: "100%" }} variant="outlined">
                            <InputLabel htmlFor="username">Usuário</InputLabel>
                            <OutlinedInput
                                name="username"
                                id="username"
                                type="text"
                                label="Usuário"
                                text="Faça seu Login"
                                required={true}
                                value={values.username}
                                onChange={(e) => {
                                    setValues({
                                        ...values,
                                        ["username"]: e.target.value,
                                    });
                                }}
                                endAdornment={
                                    <InputAdornment position="end">
                                        {<AccountCircleIcon />}
                                    </InputAdornment>
                                }
                            ></OutlinedInput>
                        </FormControl>
                        <FormControl sx={{ width: "100%" }} variant="outlined">
                            <InputLabel htmlFor="password">Senha</InputLabel>
                            <OutlinedInput
                                name="password"
                                id="password"
                                label="Senha"
                                type={showPassword ? "text" : "password"}
                                text="Faça seu Login"
                                required={true}
                                value={values.password}
                                onChange={(e) => {
                                    setValues({
                                        ...values,
                                        ["password"]: e.target.value,
                                    });
                                }}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() => {
                                                setShowPassword(!showPassword);
                                            }}
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                }
                            ></OutlinedInput>
                        </FormControl>
                        <Stack
                            id="login"
                            direction="column"
                            justifyContent="center"
                            alignItems={"center"}
                            width="100%"
                            spacing={1}
                        >
                            <Button
                                variant="contained"
                                sx={{ width: "80%", padding: '1%' }}
                                onClick={() => {
                                    onSubmit(values);
                                }}
                            >
                                Entrar
                            </Button>
                        </Stack>


                        <br />
                        <br />
                    </Paper>
                </Stack>
            </OnePageComponentSmall>
            {posted && <WaitAction
                erro={erro.status}
                ErrMsg={erro.mensagem}
                onClose={() => {
                    setPosted(false);
                    setErro({
                        status: false,
                        mensagem: "",
                    });
                }}
            />}

        </>
    );
}
