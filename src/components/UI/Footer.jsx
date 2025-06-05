import React from "react";
import qemLogo from "../../assets/qem.png"; // ajuste o caminho conforme necessário

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-logo">
          <img src={qemLogo} alt="Logo QEM" className="footer-img" />
        </div>
        <div className="footer-text">
          <p><strong>TC Bandeira</strong> – Apoio e permissão para execução do projeto.</p>
          <p><strong>TC Leonam Magno</strong> – Orientações técnicas e estratégicas.</p>
          <p><strong>Cap Roballo</strong> – Levantamento de Dados.</p>
          <p><strong>Cap Matheus Garcia</strong> – Desenvolvimento do sistema.</p>
          <p><strong>Sgt Dos Reis</strong> – Expertise processual institucional.</p>
          <p><strong>Sgt Tatiane</strong> e <strong>Sgt Bruna</strong> – Apoio diário às demandas da equipe.</p>
          <p className="footer-copy">
            © {new Date().getFullYear()} Seção Técnica da CRO3.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
