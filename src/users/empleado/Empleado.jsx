import React, { useState } from 'react';
import { 
  FaUsers, FaUserTie, FaUserCog, FaUser, 
  FaCalendarAlt, FaChevronLeft, FaChevronRight,
  FaBuilding, FaBell, FaSearch, FaUserCircle
} from 'react-icons/fa';

import "/src/Estilos/Ceo.css";
import { Link } from 'react-router-dom';
import { FaPerson } from 'react-icons/fa6';

function DashboardEmpresa() {
  const [fechaActual, setFechaActual] = useState(new Date());
  const [seccionActiva, setSeccionActiva] = useState('directores');

  // Datos de ejemplo
  const empresaData = {
    nombre: "MI EMPRESA S.A.S.",
    nit: "900.123.456-7"
  };

  // Función para cambiar mes
  const cambiarMes = (incremento) => {
    setFechaActual(new Date(fechaActual.getFullYear(), fechaActual.getMonth() + incremento, 1));
  };

  // Obtener días del mes
  const getDiasDelMes = () => {
    const año = fechaActual.getFullYear();
    const mes = fechaActual.getMonth();
    const primerDia = new Date(año, mes, 1).getDay();
    const ultimoDia = new Date(año, mes + 1, 0).getDate();
    
    const dias = [];
    // Ajustar para que la semana empiece en lunes (1) en lugar de domingo (0)
    const primerDiaAjustado = primerDia === 0 ? 6 : primerDia - 1;
    
    // Días vacíos antes del primer día del mes
    for (let i = 0; i < primerDiaAjustado; i++) {
      dias.push(null);
    }
    
    // Días del mes
    for (let i = 1; i <= ultimoDia; i++) {
      dias.push(i);
    }
    
    return dias;
  };

  const diasSemana = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
  const diasDelMes = getDiasDelMes();

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
            <Link to="/PanelAdmin" className="boton-panel-admin">Ir a Panel Admin</Link> 
          </div>
        ); 
      default:
        return null;
    }
  };

  return (
    <div className="dashboard-container">
      {/* Header con título y NIT */}
      <header className="dashboard-header">
        <div className="header-left">
          <FaBuilding className="header-icon" />
        </div>
        
        <div className="header-center">
          <h1 className="empresa-titulo">{empresaData.nombre}</h1>
          <div className="empresa-nit">
            <span className="nit-label">NIT</span>
            <span className="nit-valor">{empresaData.nit}</span>
          </div>
        </div>
        
        <div className="header-right">
          <FaBell className="header-icon notificacion" />
          <FaSearch className="header-icon busqueda" />
          <FaUserCircle className="header-icon perfil" />
        </div>
      </header>

      {/* Contenido principal */}
      <div className="dashboard-main">
        {/* Barra lateral izquierda - Navegación */}
        <aside className="sidebar-left">
          <nav className="nav-menu">
            
            <button 
              className={`nav-item ${seccionActiva === 'lideres' ? 'activo' : ''}`}
              onClick={() => setSeccionActiva('lideres')}
            >
              <FaUserCog className="nav-icon" />
              <span>Líderes</span>
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
          <div className="calendario-container">
            <div className="calendario-header">
              <button onClick={() => cambiarMes(-1)} className="mes-nav">
                <FaChevronLeft />
              </button>
              <h3>
                {fechaActual.toLocaleString('default', { month: 'long' })} {fechaActual.getFullYear()}
              </h3>
              <button onClick={() => cambiarMes(1)} className="mes-nav">
                <FaChevronRight />
              </button>
            </div>

            <div className="calendario-semana">
              {diasSemana.map(dia => (
                <div key={dia} className="dia-semana">{dia}</div>
              ))}
            </div>

            <div className="calendario-dias">
              {diasDelMes.map((dia, index) => (
                <div key={index} className={`dia-mes ${dia ? '' : 'vacio'}`}>
                  {dia && (
                    <>
                      <span className="dia-numero">{dia}</span>
                      {dia === 15 && <span className="evento-indicador"></span>}
                    </>
                  )}
                </div>
              ))}
            </div>

            <div className="calendario-eventos">
              <h4>Eventos del día</h4>
              <div className="evento-item">
                <span className="evento-hora">10:00</span>
                <span className="evento-titulo">Reunión directores</span>
              </div>
              <div className="evento-item">
                <span className="evento-hora">14:30</span>
                <span className="evento-titulo">Evaluación líderes</span>
              </div>
              <div className="evento-item">
                <span className="evento-hora">16:00</span>
                <span className="evento-titulo">Entrega reportes</span>
              </div>
            </div>
          </div>
        </aside>
      </div>

    
    </div>
  );
}

export default DashboardEmpresa;