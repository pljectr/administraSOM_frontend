import React, { useEffect, useState } from "react";
import TableComp from "../Features/Table/TableComp";
import Axios from "axios";

function ShowLogs(props) {
  const docId = props.docId
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    setLoading(true);
    setErro(null);

    Axios({
      method: "GET",
      withCredentials: true,
      url: `${process.env.REACT_APP_BACK_SERVER_LOCATION}/api/activities/${docId}`,
    })
      .then((res) => {
        if (!res.data.erro) {
          setLogs(
            res.data.atividades.map(log => ({
              ...log,
              timestamp: new Date(log.timestamp).toLocaleString()
            }))
          );
        } else {
          setErro(res.data.mensagem || "Erro ao buscar logs");
        }
      })
      .catch((err) => {
        console.warn("Erro ao buscar logs:", err);
        setErro(
          err.response?.data?.mensagem || "Erro ao conectar com o servidor"
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, [docId]);

  return (
    <div style={{ padding: "1rem" }}>

      {loading && <p>Carregando logs...</p>}

      {erro && <p style={{ color: "red" }}>Erro: {erro}</p>}

      {!loading && !erro && logs.length === 0 && <p>Nenhum log encontrado.</p>}


      {logs.length > 0  && <TableComp
        items={logs}
        tableHead={["Ação", "Descrição", "Horário", "IP"]}
        objkeys={{
          action: '',
          description: '',
          timestamp: '',
          ip: ''
        }}
        WhenClicked={() => { }}
       // addItem={() => { }}
        whatToSearch={props.title}
      />}


    </div>
  );
}

export default ShowLogs;
