import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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
          setLogs(res.data.atividades);
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
      <h2>Logs do Documento: {docId}</h2>

      {loading && <p>Carregando logs...</p>}

      {erro && <p style={{ color: "red" }}>Erro: {erro}</p>}

      {!loading && !erro && logs.length === 0 && <p>Nenhum log encontrado.</p>}

      <ul>
        {logs.map((log) => (
          <li key={log._id} style={{ marginBottom: "1rem" }}>
            <strong>{log.action}</strong> - {log.description}
            <br />
            <small>
              {new Date(log.timestamp).toLocaleString()} | IP: {log.ip}
            </small>
            <hr />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ShowLogs;
