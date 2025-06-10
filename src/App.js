
import './utils/styles/App.css';
import './utils/styles/textStyles.css';
import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Axios from "axios";
import HomeTest from "./pages/HomeTest";
import Matriz from './pages/Matriz'
import Login from "./pages/Login";
import NewContractForm from './pages/Forms/NewContractForm';
export default function App() {
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
    <div className="App">
      <header className="App-header">
        <Matriz>
          <Routes>
           {auth.status && <Route path="/" exact element={<HomeTest user={auth.user} /> }/>    } 
            <Route path="/successTest" exact element={<HomeTest user={auth.user} />} />
            <Route path="/contracts/new" element={<NewContractForm />} />
            {/*  {auth.status && <Route path="/cadastros/empresas/:thenewobject" exact element={<Empresas user={auth.user} />} />} */}
            <Route path="/login" exact element={<Login />} />

          </Routes>
        </Matriz>
      </header>
    </div>
  </BrowserRouter >
}