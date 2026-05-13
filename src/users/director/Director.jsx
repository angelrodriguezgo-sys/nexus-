import React, { useState, useEffect } from 'react';
import { FaUsers, FaUserTie, FaUserCog, FaUser } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { FaPerson } from 'react-icons/fa6';
import DashboardHeader from '../../components/DashboardHeader';
import Calendario from '../../components/Calendario';
import '../../Estilos/Ceo.css';
import { useAuth } from '../../context/AuthContext';



function Director() {
  const { user, empresa, loading, logout } = useAuth();
  const navigate = useNavigate();
  const [seccionActiva, setSeccionActiva] = useState('directores');

  // ✅ Redirigir si no hay usuario o no es director
  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
    if (!loading && user && user.rol !== 'director') {
      navigate('/');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return <div className="loading-container">Cargando...</div>;
  }

  if (!user || user.rol !== 'director') {
    return null;
  }

  // ✅ DATOS REALES DE LA EMPRESA DESDE AUTHCONTEXT
  const empresaData = {
    id: empresa?.id || user?.empresa_id,
    nombre: empresa?.nombre || 'Mi Empresa',
    nit: empresa?.nit || 'NIT no registrado',
    plan_id: empresa?.plan_id || 'plan_profesional',
    max_usuarios: empresa?.max_usuarios || 50,
    usuarios_actuales: empresa?.usuarios_actuales || 0,
    rol: 'director',
    area: user?.area || 'Ventas',
    soloMiArea: true
  };

  // ✅ Funciones del calendario
  const [fechaActual, setFechaActual] = useState(new Date());

  const cambiarMes = (incremento) => {
    setFechaActual(new Date(fechaActual.getFullYear(), fechaActual.getMonth() + incremento, 1));
  };

  const getDiasDelMes = () => {
    const año = fechaActual.getFullYear();
    const mes = fechaActual.getMonth();
    const primerDia = new Date(año, mes, 1).getDay();
    const ultimoDia = new Date(año, mes + 1, 0).getDate();
    
    const dias = [];
    const primerDiaAjustado = primerDia === 0 ? 6 : primerDia - 1;
    
    for (let i = 0; i < primerDiaAjustado; i++) dias.push(null);
    for (let i = 1; i <= ultimoDia; i++) dias.push(i);
    
    return dias;
  };

  const diasSemana = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
  const diasDelMes = getDiasDelMes();

  const renderContenidoCentral = () => {
    switch(seccionActiva) {
      case 'admin':
        return <PanelAdmin empresaData={empresaData} />;
      case 'directores':
        return (
          <div className="seccion-contenido">
            <h3>Directores - Área {empresaData.area}</h3>
            <div className="tarjetas-grid">
              {[1].map(i => (
                <div key={i} className="tarjeta-persona director">
                  <FaUserTie className="tarjeta-icono" />
                  <h4>Director {i}</h4>
                  <p>Área: {empresaData.area}</p>
                  <span className="badge">Activo</span>
                </div>
              ))}
            </div>
          </div>
        );
      case 'lideres':
        return (
          <div className="seccion-contenido">
            <h3>Líderes a cargo</h3>
            <div className="tarjetas-grid">
              {[1, 2].map(i => (
                <div key={i} className="tarjeta-persona lider">
                  <FaUserCog className="tarjeta-icono" />
                  <h4>Líder {i}</h4>
                  <p>Equipo: {empresaData.area} {i}</p>
                  <span className="badge">Activo</span>
                </div>
              ))}
            </div>
          </div>
        );
      case 'empleados':
        return (
          <div className="seccion-contenido">
            <h3>Empleados del área</h3>
            <div className="tarjetas-grid">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="tarjeta-persona empleado">
                  <FaUser className="tarjeta-icono" />
                  <h4>Empleado {i}</h4>
                  <p>Puesto: {i === 1 ? 'Analista' : 'Asistente'}</p>
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
    <div className="dashboard-container director">
      <DashboardHeader empresaData={empresaData} userRole={`DIRECTOR - ${empresaData.area}`} />
      
      <div className="dashboard-main">
        <aside className="sidebar-left">
          <nav className="nav-menu">
            <button 
              className={`nav-item ${seccionActiva === 'admin' ? 'activo' : ''}`}
              onClick={() => setSeccionActiva('admin')}
            >
              <FaPerson className="nav-icon" />
              <span>Admin Mi Área</span>
            </button>

            <button 
              className={`nav-item ${seccionActiva === 'directores' ? 'activo' : ''}`}
              onClick={() => setSeccionActiva('directores')}
            >
              <FaUserTie className="nav-icon" />
              <span>Mi Dirección</span>
            </button>

            <button 
              className={`nav-item ${seccionActiva === 'lideres' ? 'activo' : ''}`}
              onClick={() => setSeccionActiva('lideres')}
            >
              <FaUserCog className="nav-icon" />
              <span>Mis Líderes</span>
            </button>
            
            <button 
              className={`nav-item ${seccionActiva === 'empleados' ? 'activo' : ''}`}
              onClick={() => setSeccionActiva('empleados')}
            >
              <FaUsers className="nav-icon" />
              <span>Mis Empleados</span>
            </button>

            <div className="nav-divider"></div>

            <button className="nav-item" onClick={logout}>
              🚪 <span>Cerrar Sesión</span>
            </button>

            <div className="nav-stats">
              <div className="stat-item">
                <span className="stat-label">Mi Área:</span>
                <span className="stat-value">{empresaData.area}</span>
              </div>
            </div>
          </nav>
        </aside>

        <main className="content-center">
          {renderContenidoCentral()}
        </main>

        <aside className="sidebar-right">
          <Calendario />
        </aside>
      </div>
    </div>
  );
}


export default Director;