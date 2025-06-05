
import ShowLogs from '../../components/UI/ShowLogs';
import Mapa from '../../components/Features/Maps/Mapa';
import AllFacilitiesMap from '../../components/Features/Maps/AllFacilitiesMap';
import UploadFiles from '../../components/Features/Upload/uploadFiles';
import "../../utils/styles/stylesCSS.css"
import TopBar from '../../components/UI/TopBar';
import Footer from '../../components/UI/Footer';
import KanbanCard from '../../components/Features/Cards/KanbanCard';

export default function HomeTest(props) {
  const handleFileSaved = (file) => {
    console.log("Arquivo salvo:", file);
  };

  const handleFileDeleted = (id) => {
    console.log("Arquivo deletado:", id);
  };


  return (
    <div className="App">
      <TopBar />

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
              : null} docId={props.user._id} />

        </div>
        <hr />
        <UploadFiles

          docId={props.user._id}
          savedFile={handleFileSaved}
          deletado={handleFileDeleted}
          doNotDelete={false} // ou true se quiser modo somente leitura
        />
        <hr />
        <ShowLogs title={`Logs do usuário ${props.user.username}`} docId={props.user._id} />
        <hr />

        <KanbanCard />
        <hr />
      </header>

      <Footer />
    </div>
  );
}

