import React from 'react';
import { Link } from 'react-router-dom';
import { FaBuilding, FaBell, FaSearch, FaUserCircle, FaCog } from 'react-icons/fa';
import '../Estilos/Ceo.css';

function DashboardHeader({ empresaData }) {
  return (
    <header className="dashboard-header">
      <div className="header-left">
        <div className="logo-section">
          <FaBuilding className="header-logo-icon" />
          <span className="logo-text"></span> {/* No tiene hipervinculo */}
        </div>
      </div>
      
      <div className="header-center">
        <div className="empresa-info">
          <h1 className="empresa-titulo">{empresaData.nombre}</h1>
          <div className="empresa-nit">
            <span className="nit-label">NIT:</span>
            <span className="nit-valor">{empresaData.nit}</span>
          </div>
        </div>
      </div>
      
      <div className="header-right">
        <Link to="/chat-empresarial" className="header-icon-link notificacion-link" title="Chat Empresarial">
          <FaBell className="header-icon notificacion" />
          <span className="badge">3</span>
        </Link>
        <button className="header-icon-btn busqueda" title="Buscar">
          <FaSearch className="header-icon" />
        </button>
        <Link to="/perfil" className="header-icon-link" title="Perfil">
          <FaUserCircle className="header-icon perfil" />
        </Link>
        <button className="header-icon-btn configuracion" title="Configuración">
          <FaCog className="header-icon" />
        </button>
      </div>
    </header>
  );
}

export default DashboardHeader;
