
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'
import ShowLogs from '../components/UI/ShowLogs';
import AllFacilitiesMap from '../components/Features/Maps/AllFacilitiesMap';
import "../utils/styles/stylesCSS.css"
import TableComp from '../components/Features/Table/TableComp'
import Footer from '../components/UI/Footer';

import api from '../services/api';
import SelectUpload from '../components/Features/Upload/SelectUpload';
export default function HomeTest(props) {

  const [contracts, setContracts] = useState([]);
  const navigate = useNavigate();
  const handleAdd = () => {
    navigate('/contracts/new');
  };

  const handleFileSaved = (file) => {
    console.log("Arquivo salvo:", file);
  };

  const handleFileDeleted = (id) => {
    console.log("Arquivo deletado:", id);
  };

  useEffect(() => {
    api.get('/api/contracts')
      .then(res => setContracts(res.data))
      .catch(err => console.error('Erro fetching contracts:', err));
  }, []);


  return (
    <div className="App">

      <header className="App-header">

        <hr />
        <p>
          Bem vindo, {props.user.userPG} {props.user.nameOfTheUser}
        </p>
        <hr />
        <div style={{ padding: "1%" }}>
          <h2>Mapa do sistema</h2>
          <AllFacilitiesMap facilityID={
            false
              ? '68408b323b33d92ff579a806' //id da EASA
              : null} />

        </div>
        <hr />
        {contracts.length > 0 && <TableComp
          items={contracts}
          objkeys={{ contractNumber: '', name: '', value: '', status: '' }}
          tableHead={['Número', 'Nome', 'Valor', 'Status']}
          addItem={handleAdd}
          whatToSearch="Contratos"
          WhenClicked={(id) => navigate(`/contracts/${id}`)}
        />}
        <hr />

        <SelectUpload
          contractId={props.user._id}
          cardId={props.user._id}
          savedFile={handleFileSaved}
          deletado={handleFileDeleted}
          doNotDelete={false} // ou true se quiser modo somente leitura
        />


        <hr />
        <ShowLogs title={`Logs do usuário ${props.user.username}`} docId={props.user._id} />
        <hr />


        <hr />
      </header>

      <Footer />
    </div>
  );
}

