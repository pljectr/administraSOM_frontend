import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Axios from "axios";
import Home from "./features/Auth/Home";
import Matriz from './features/Matriz/Matriz'
import Login from "./features/Auth/Login";
export default function Root() {
  const [auth, setAuth] = useState({
    status: false,
    user: {},

  });
  useEffect(() => {
    Axios({
      method: "GET",
      withCredentials: true,
      url: `${process.env.REACT_APP_BACK_SERVER_LOCATION}/api/users/auth`,
    })
      .then((res) => {
        console.log(res.data);
        setAuth(res.data);
      })
      .catch((err) => {
        console.warn("Usuário não autenticado ou erro no servidor:", err);
        setAuth({ status: false, user: {} }); // Força o estado "não autenticado"
      });
  }, []);


  return <BrowserRouter>
    <div className="App ">
      <header className="App-header">
        <Matriz>
          <Routes>
           {auth.status && <Route path="/" exact element={<Home user={auth.user} /> }/>    } 
            <Route path="/successTest" exact element={<Home user={auth.user} />} />
            {/*  {auth.status && <Route path="/cadastros/empresas/:thenewobject" exact element={<Empresas user={auth.user} />} />} */}
            <Route path="/login" exact element={<Login />} />

          </Routes>
        </Matriz>
      </header>
    </div>
  </BrowserRouter >
}