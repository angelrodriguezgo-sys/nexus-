import React from 'react';
import { Link } from 'react-router-dom';
import { FaBuilding, FaBell, FaSearch, FaUserCircle, FaCog } from 'react-icons/fa';
import '../Estilos/HeaderInt.css';  

function HeaderInt({ empresaData, userRole }) {
  // Función para determinar la ruta según el rol
  const getHomeRoute = () => {
    const routes = {
      ceo: '/CeoPage',
      director: '/DirectorPage',
      lider: '/LiderPage',
      empleado: '/EmpleadoPage',
    };

    const normalizedRole = String(userRole || '').trim().toLowerCase();
    return routes[normalizedRole] || '/';
  };

  return (
    <header className="dashboard-header">
      <div className="header-left">
        <div className="logo-section">
          <Link to={getHomeRoute()} className="logo-link">
            <FaBuilding className="header-logo-icon" />
            <span className="logo-text"> </span> {/* Tiene hipervinculo */}
          </Link>
        </div>
      </div>
      
      <div className="header-center">
        <div className="empresa-info">
          <h1 className="empresa-titulo">{empresaData?.nombre || "Mi Empresa"}</h1>
          <div className="empresa-nit">
            <span className="nit-label">NIT:</span>
            <span className="nit-valor">{empresaData?.nit || "Sin NIT"}</span>
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

export default HeaderInt;