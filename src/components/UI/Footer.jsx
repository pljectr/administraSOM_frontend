import React from "react";


const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <p><strong>TC Bandeira</strong> – Apoio e permissão para execução do projeto.</p>
        <p><strong>TC Leonam Magno</strong> – Orientações técnicas e estratégicas.</p>
        <p><strong>Cap Roballo</strong> – Levantamento de Dados.</p>
        <p><strong>Cap Matheus Garcia</strong> – Desenvolvimento completo do sistema.</p>
        <p><strong>Sgt Dos Reis</strong> – Expertise processual institucional.</p>
        <p><strong>Sgt Tatiane</strong> e <strong>Sgt Bruna</strong> – Apoio diário às demandas da equipe.</p>
        <p className="footer-copy">
          © {new Date().getFullYear()} Seção Técnica da CRO3.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
