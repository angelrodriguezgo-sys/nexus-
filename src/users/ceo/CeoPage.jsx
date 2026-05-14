// users/ceo/CeoPage.jsx
import React, { useState, useEffect } from 'react';
import { 
  FaUsers, FaUserTie, FaUserCog, FaUser
} from 'react-icons/fa';
import { FaPerson } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom';

import HeaderInt from '../../components/HeaderInt';
import Calendario from '../../components/Calendario';
import '../../Estilos/Ceo.css';
import { useAuth } from '../../context/AuthContext';

function CeoPage() {
  const { user, empresa, loading, logout } = useAuth();
  const navigate = useNavigate();
  const [seccionActiva, setSeccionActiva] = useState('directores');

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login', { replace: true });
    } catch (err) {
      console.error('Error al cerrar sesión:', err);
      alert('Hubo un problema al cerrar sesión. Intenta nuevamente.');
    }
  };

  useEffect(() => {
    if (!loading && !user) navigate('/login');
    if (!loading && user && user.rol !== 'ceo') navigate('/dashboard');
  }, [user, loading, navigate]);

  if (loading) return <div className="loading">Cargando...</div>;
  if (!user || user.rol !== 'ceo') return null;

  const empresaData = {
    id: empresa?.id || user?.empresa_id,
    nombre: empresa?.nombre || 'Mi Empresa',
    nit: empresa?.nit || 'NIT no registrado',
    plan_id: empresa?.plan_id || 'plan_basico',
    max_usuarios: empresa?.max_usuarios || 10,
    usuarios_actuales: empresa?.usuarios_actuales || 0,
    rol: 'ceo',
    area: 'General'
  };

  // ✅ Función para navegar al panel admin
  const irAPanelAdmin = () => {
    navigate('/PanelAdmin', { state: { empresaData } });
  };

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
                </div>
              ))}
            </div>
          </div>
        );
      case 'lideres':
        return (
          <div className="seccion-contenido">
            <h3>Líderes</h3>
            <div className="tarjetas-grid">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="tarjeta-persona lider">
                  <FaUserCog className="tarjeta-icono" />
                  <h4>Líder {i}</h4>
                  <p>Equipo: {i === 1 ? 'Ventas' : i === 2 ? 'Soporte' : 'Desarrollo'}</p>
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
                  <p>Puesto: Desarrollador</p>
                </div>
              ))}
            </div>
          </div>
        );
      default: return null;
    }
  };

  return (
    <div className="dashboard-container ceo">
      <HeaderInt empresaData={empresaData} userRole="CEO" />
      
      <div className="dashboard-main">
        <aside className="sidebar-left">
          <nav className="nav-menu">
            {/* ✅ BOTÓN CORREGIDO - Usando onClick y pasando empresaData */}
            <button className="boton-panel-admin" onClick={irAPanelAdmin}>
              Panel de Administracion
            </button>
            
            <button 
              className={`nav-item ${seccionActiva === 'directores' ? 'activo' : ''}`} 
              onClick={() => setSeccionActiva('directores')}
            >
              <FaUserTie className="nav-icon" /> <span>Directores</span>
            </button>
            <button 
              className={`nav-item ${seccionActiva === 'lideres' ? 'activo' : ''}`} 
              onClick={() => setSeccionActiva('lideres')}
            >
              <FaUserCog className="nav-icon" /> <span>Líderes</span>
            </button>
            <button 
              className={`nav-item ${seccionActiva === 'empleados' ? 'activo' : ''}`} 
              onClick={() => setSeccionActiva('empleados')}
            >
              <FaUsers className="nav-icon" /> <span>Empleados</span>
            </button>
            <div className="nav-divider"></div>
            <button className="nav-item" onClick={handleLogout}>
              🚪 <span>Cerrar Sesión</span>
            </button>
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

export default CeoPage;