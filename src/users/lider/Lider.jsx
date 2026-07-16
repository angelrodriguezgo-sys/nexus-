import React, { useState, useEffect } from 'react';
import { FaUsers, FaUserTie, FaUserCog, FaUser } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { FaPerson } from 'react-icons/fa6';
import HeaderInt from '../../components/HeaderInt';
import Calendario from '../../components/Calendario';
import '../../Estilos/Ceo.css';
import { useAuth } from '../../context/AuthContext';

function Lider() {
  const { user, empresa, loading, logout } = useAuth();
  const navigate = useNavigate();
  const [seccionActiva, setSeccionActiva] = useState('empleados');

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login', { replace: true });
    } catch (err) {
      console.error('Error al cerrar sesión:', err);
      alert('Hubo un problema al cerrar sesión. Intenta nuevamente.');
    }
  };

  // ✅ Redirigir si no hay usuario o no es líder
  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
      return;
    }
    if (!loading && user && user.rol) {
      const role = String(user.rol || '').toLowerCase();
      if (role !== 'lider') {
        switch(role) {
          case 'ceo':
            navigate('/CeoPage');
            break;
          case 'director':
            navigate('/DirectorPage');
            break;
          case 'empleado':
            navigate('/EmpleadoPage');
            break;
          default:
            navigate('/login');
        }
      }
    }
  }, [user, loading, navigate]);

  if (loading) {
    return <div className="loading-container">Cargando...</div>;
  }

  if (!user || user.rol !== 'lider') {
    return null;
  }

  // ✅ DATOS REALES DE LA EMPRESA DESDE AUTHCONTEXT
  const empresaData = {
    nombre: empresa?.nombre || 'Mi Empresa',
    nit: empresa?.nit || 'NIT no registrado',
    plan_id: empresa?.plan_id || 'plan_profesional'
  };

  // ✅ DATOS DEL LÍDER LOGUEADO
  const liderData = {
    nombre: user?.nombre || '',
    apellido: user?.apellido || '',
    email: user?.email,
    equipo: user?.equipo || 'Lider de Equipo',
    area: user?.area || 'Operaciones'
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
      case 'directores':
        return (
          <div className="seccion-contenido">
            <h3>Mi Director</h3>
            <div className="tarjetas-grid">
              <div className="tarjeta-persona director">
                <FaUserTie className="tarjeta-icono" />
                <h4>Director</h4>
                <p>Área: {liderData.area}</p>
              </div>
            </div>
          </div>
        );
      case 'lideres':
        return (
          <div className="seccion-contenido">
            <h3>Mi Equipo - {liderData.equipo}</h3>
            <div className="tarjetas-grid">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="tarjeta-persona lider">
                  <FaUserCog className="tarjeta-icono" />
                  <h4>Líder del equipo</h4>
                  <p>Equipo: {liderData.equipo}</p>
                </div>
              ))}
            </div>
          </div>
        );
      case 'empleados':
        return (
          <div className="seccion-contenido">
            <h3>Miembros de mi Equipo</h3>
            <div className="tarjetas-grid">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="tarjeta-persona empleado">
                  <FaUser className="tarjeta-icono" />
                  <h4>Empleado {i}</h4>
                  <p>Puesto: {i === 1 ? 'Desarrollador' : i === 2 ? 'Diseñador' : i === 3 ? 'Analista' : i === 4 ? 'Soporte' : 'Ventas'}</p>
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
    <div className="dashboard-container lider">
      <HeaderInt empresaData={empresaData} userRole={`LÍDER - ${liderData.equipo}`} />
      
      <div className="dashboard-main">
        <aside className="sidebar-left">
          <nav className="nav-menu">
            <button 
              className={`nav-item ${seccionActiva === 'directores' ? 'activo' : ''}`}
              onClick={() => setSeccionActiva('directores')}
            >
              <FaUserTie className="nav-icon" />
              <span>Mi Director</span>
            </button>

            <button 
              className={`nav-item ${seccionActiva === 'lideres' ? 'activo' : ''}`}
              onClick={() => setSeccionActiva('lideres')}
            >
              <FaUserCog className="nav-icon" />
              <span>Mi Equipo</span>
            </button>

            <button 
              className={`nav-item ${seccionActiva === 'empleados' ? 'activo' : ''}`}
              onClick={() => setSeccionActiva('empleados')}
            >
              <FaUsers className="nav-icon" />
              <span>Miembros</span>
            </button>

            <div className="nav-divider"></div>

           

            <div className="nav-stats">
              <div className="stat-item">
                <span className="stat-label">Mi Equipo:</span>
                <span className="stat-value">{liderData.equipo}</span>
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


export default Lider;