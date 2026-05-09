import React, { useState } from 'react';
import { FaUsers, FaUserTie, FaUserCog, FaUser } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { FaPerson } from 'react-icons/fa6';
import DashboardHeader from '../../components/DashboardHeader';
import Calendario from '../../components/Calendario';
import '../../Estilos/Ceo.css';

function Empleado() {
  const [fechaActual, setFechaActual] = useState(new Date());
  const [seccionActiva, setSeccionActiva] = useState('directores');

  const userRole = 'Empleado'; // Este valor debería venir de la autenticación del usuario
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
   
      default:
        return null;
    }
  };

  return (
    <div className="dashboard-container empleado">
      <DashboardHeader empresaData={empresaData} />

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

            <button 
              className={`nav-item ${seccionActiva === 'empleados' ? 'activo' : ''}`}
              onClick={() => setSeccionActiva('empleados')}
            >
              <FaUsers className="nav-icon" />
              <span>Empleados</span>
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

export default Empleado;