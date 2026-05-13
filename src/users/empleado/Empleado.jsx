import React, { useState } from 'react';
import { FaUsers, FaUserTie, FaUserCog, FaUser } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { FaPerson } from 'react-icons/fa6';
import DashboardHeader from '../../components/DashboardHeader';
import Calendario from '../../components/Calendario';
import '../../Estilos/Ceo.css';
import { useAuth } from '../../context/AuthContext';

function Empleado() {
  const { user, empresa, loading, logout } = useAuth();
  const navigate = useNavigate();
  const [seccionActiva, setSeccionActiva] = useState('empleados');

  // ✅ Redirigir si no hay usuario o no es empleado
  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
    if (!loading && user && user.rol !== 'empleado') {
      navigate('/dashboard');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return <div className="loading-container">Cargando...</div>;
  }

  if (!user || user.rol !== 'empleado') {
    return null;
  }

  // ✅ DATOS REALES DE LA EMPRESA DESDE AUTHCONTEXT
  const empresaData = {
    nombre: empresa?.nombre || 'Mi Empresa',
    nit: empresa?.nit || 'NIT no registrado',
    plan_id: empresa?.plan_id || 'plan_basico'
  };

  // ✅ DATOS DEL EMPLEADO LOGUEADO
  const empleadoData = {
    nombre: user?.nombre || '',
    apellido: user?.apellido || '',
    email: user?.email,
    cargo: user?.cargo || 'Empleado',
    equipo: user?.equipo || 'General'
  };

  // ✅ Funciones del calendario (se mantienen igual)
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
      case 'lideres':
        return (
          <div className="seccion-contenido">
            <h3>Mis Líderes</h3>
            <div className="tarjetas-grid">
              {[1, 2].map(i => (
                <div key={i} className="tarjeta-persona lider">
                  <FaUserCog className="tarjeta-icono" />
                  <h4>Líder {i}</h4>
                  <p>Equipo: {empleadoData.equipo}</p>
                  <span className="badge">Activo</span>
                </div>
              ))}
            </div>
          </div>
        );
      case 'empleados':
        return (
          <div className="seccion-contenido">
            <h3>Mis Compañeros</h3>
            <div className="tarjetas-grid">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="tarjeta-persona empleado">
                  <FaUser className="tarjeta-icono" />
                  <h4>Compañero {i}</h4>
                  <p>Puesto: Desarrollo</p>
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
      <DashboardHeader empresaData={empresaData} userRole={`EMPLEADO - ${empleadoData.equipo}`} />
      
      <div className="dashboard-main">
        <aside className="sidebar-left">
          <nav className="nav-menu">
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
              <span>Compañeros</span>
            </button>

            <div className="nav-divider"></div>

            <button className="nav-item" onClick={logout}>
              🚪 <span>Cerrar Sesión</span>
            </button>

            <div className="nav-stats">
              <div className="stat-item">
                <span className="stat-label">Mi Rol:</span>
                <span className="stat-value">{user?.rol?.toUpperCase()}</span>
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

export default Empleado;