import cro3 from '../../assets/cro3.png'
import Axios from "axios";
import ShowLogs from '../../components/UI/ShowLogs';
import UploadFiles from '../../components/Features/Upload/uploadFiles';
import "../../utils/styles/stylesCSS.css"
import '../../App.css'
import TopBar from  '../../components/UI/TopBar';
import Footer from '../../components/UI/Footer';

export default function Home(props) {
  const handleFileSaved = (file) => {
    console.log("Arquivo salvo:", file);
  };

  const handleFileDeleted = (id) => {
    console.log("Arquivo deletado:", id);
  };


  return (
    <div className="App">
      <TopBar/>

      <header className="App-header">

        <hr />
        <p>
          Bem vindo, {props.user.userPG} {props.user.nameOfTheUser}

          <hr />
          <h1>Uploads da Pasta</h1>
          <UploadFiles
            docId={props.user._id}
            savedFile={handleFileSaved}
            deletado={handleFileDeleted}
            doNotDelete={false} // ou true se quiser modo somente leitura
          />
          <hr />
          <ShowLogs docId={props.user._id} />
        </p>
      </header>
      <Footer />
    </div>
  );
}

