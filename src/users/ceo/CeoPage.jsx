import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaUsers, FaUserTie, FaUserCog, FaUser
} from 'react-icons/fa';
import { FaPerson } from 'react-icons/fa6';

import DashboardHeader from '../../components/DashboardHeader';
import Calendario from '../../components/Calendario';
import '../../Estilos/Ceo.css';

function DashboardEmpresa() {
  const [seccionActiva, setSeccionActiva] = useState('directores');

  // Datos de empresa
  const empresaData = {
    nombre: "MI EMPRESA S.A.S.",
    nit: "900.123.456-7"
  };

  // Contenido dinámico según la sección activa
  const renderContenidoCentral = () => {
    switch(seccionActiva) {
      case 'directores':
        return (
          <div className="seccion-contenido">
            <h3>Directores</h3>
            <div className="tarjetas-grid">
              {[1, 2, 3].map(i => (
                <div key={i} className="tarjeta-persona director">
                  <FaUserTie className="tarjeta-icono" />
                  <h4>Director {i}</h4>
                  <p>Área: {i === 1 ? 'Ventas' : i === 2 ? 'Marketing' : 'Operaciones'}</p>
                  <span className="badge">Activo</span>
                </div>
              ))}
            </div>
          </div>
        );
      case 'lideres':
        return (
          <div className="seccion-contenido">
            <h3>Líderes de Equipo</h3>
            <div className="tarjetas-grid">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="tarjeta-persona lider">
                  <FaUserCog className="tarjeta-icono" />
                  <h4>Líder {i}</h4>
                  <p>Equipo: {i === 1 ? 'Ventas' : i === 2 ? 'Soporte' : i === 3 ? 'Desarrollo' : 'Diseño'}</p>
                  <span className="badge">Activo</span>
                </div>
              ))}
            </div>
          </div>
        );
      case 'empleados':
        return (
          <div className="seccion-contenido">
            <h3>Empleados</h3>
            <div className="tarjetas-grid">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="tarjeta-persona empleado">
                  <FaUser className="tarjeta-icono" />
                  <h4>Empleado {i}</h4>
                  <p>Puesto: {i === 1 ? 'Desarrollador' : i === 2 ? 'Diseñador' : i === 3 ? 'Analista' : i === 4 ? 'Soporte' : 'Ventas'}</p>
                  <span className="badge">Activo</span>
                </div>
              ))}
            </div>
          </div>
        );
      case 'PanelAdmin':
        return (
          <div className="seccion-contenido">
            <Link to="/PanelAdmin" className="boton-panel-admin">Panel de Administracion</Link>  {/* agregar apertura de nueva pagina */}
          </div>
        ); 
      default:
        return null;
    }
  };

  return (
    <div className="dashboard-container">
      {/* Header con título y NIT */}
      <DashboardHeader empresaData={empresaData} />

      {/* Contenido principal */}
      <div className="dashboard-main">
        {/* Barra lateral izquierda - Navegación */}
        <aside className="sidebar-left">
          <nav className="nav-menu">
            <button 
              className={`nav-item ${seccionActiva === 'directores' ? 'activo' : ''}`}
              onClick={() => setSeccionActiva('directores')}
            >
              <FaUserTie className="nav-icon" />
              <span>Directores</span>
            </button>
            
            <button 
              className={`nav-item ${seccionActiva === 'lideres' ? 'activo' : ''}`}
              onClick={() => setSeccionActiva('lideres')}
            >
              <FaUserCog className="nav-icon" />
              <span>Líderes</span>
            </button>
            
            <button 
              className={`nav-item ${seccionActiva === 'empleados' ? 'activo' : ''}`}
              onClick={() => setSeccionActiva('empleados')}
            >
              <FaUsers className="nav-icon" />
              <span>Empleados</span>
            </button>

            <button 
              className={`nav-item ${seccionActiva === 'PanelAdmin' ? 'activo' : ''}`}
              onClick={() => setSeccionActiva('PanelAdmin')}
            >
              <FaPerson className="nav-icon" />
              <span>Panel Administrador</span>
            </button>

            <div className="nav-divider"></div>

            <div className="nav-stats">
              <div className="stat-item">
                <span className="stat-label">Total:</span>
                <span className="stat-value">12</span>
              </div>
            </div>
          </nav>
        </aside>

        {/* Espacio central - Contenido dinámico */}
        <main className="content-center">
          {renderContenidoCentral()}
        </main>

        {/* Barra lateral derecha - Calendario */}
        <aside className="sidebar-right">
          <Calendario />
        </aside>
      </div>

    
    </div>
  );
}

export default DashboardEmpresa;
