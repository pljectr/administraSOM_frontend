import cro3 from '../../assets/cro3.png'
import Axios from "axios";
import ShowLogs from '../../components/UI/ShowLogs';
import UploadFiles from '../../components/Features/Upload/uploadFiles';
import "../../utils/styles/stylesCSS.css"
import '../../App.css'

export default function Home(props) {
  const handleFileSaved = (file) => {
    console.log("Arquivo salvo:", file);
  };

  const handleFileDeleted = (id) => {
    console.log("Arquivo deletado:", id);
  };

  const handleLogout = () => {
    Axios.get(`${process.env.REACT_APP_BACK_SERVER_LOCATION}/api/users/logout`, {
      withCredentials: true,
    })
      .then(() => {
        window.location.href = "/login";
        window.reload();
      })
      .catch((err) => {
        console.error("Erro ao deslogar:", err);
      });
  };
  return (
    <div className="App">
      <button className="logout-button" onClick={handleLogout}>
        Logout
      </button>
      <header className="App-header">
        <img src={cro3} className="App-logo" alt="logo" />
        <p>
          administraSOM

        </p>
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
    </div>
  );
}

