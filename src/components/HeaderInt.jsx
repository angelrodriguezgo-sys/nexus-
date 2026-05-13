import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaBuilding, FaBell, FaSearch, FaUserCircle, FaCog } from 'react-icons/fa';
import '../Estilos/HeaderInt.css';  

function HeaderInt({ empresaData, userRole: userRoleProp }) {
  const navigate = useNavigate();

  // ============================================================
  // 1. FUNCIÓN PARA OBTENER EL ROL (desde props o localStorage)
  // ============================================================
  const getUserRole = () => {
    // Si viene por props, usarlo
    if (userRoleProp) return userRoleProp;
    
    // Si no, intentar obtener del localStorage (o contexto)
    try {
      const user = localStorage.getItem('user');
      if (user) {
        const parsedUser = JSON.parse(user);
        return parsedUser.rol;
      }
    } catch (e) {
      console.error('Error al obtener rol:', e);
    }
    
    // Valor por defecto
    return 'empleado';
  };

  // ============================================================
  // 2. FUNCIÓN PARA DETERMINAR LA RUTA SEGÚN EL ROL
  // ============================================================
  const getHomeRoute = () => {
    const rol = getUserRole();
    
    // Mapa de rutas por rol
    const routes = {
      ceo: '/dashboard/ceo',
      director: '/dashboard/director',
      lider: '/dashboard/lider',
      empleado: '/dashboard/empleado'
    };

    // Normalizar el rol (minúsculas, sin espacios)
    const normalizedRole = String(rol || '').trim().toLowerCase();
    
    // Verificar si el rol existe en el mapa
    if (routes[normalizedRole]) {
      return routes[normalizedRole];
    }
    
    // Rol no reconocido, redirigir a login
    console.warn(`Rol no reconocido: ${rol}`);
    return '/login';
  };

  // ============================================================
  // 3. FUNCIÓN PARA OBTENER NOMBRE DEL ROL
  // ============================================================
  const getRolNombre = () => {
    const rol = getUserRole();
    const roles = {
      ceo: 'CEO',
      director: 'DIRECTOR',
      lider: 'LÍDER',
      empleado: 'EMPLEADO'
    };
    return roles[rol] || 'USUARIO';
  };

  // ============================================================
  // 4. FUNCIÓN PARA OBTENER ICONO DEL ROL
  // ============================================================
  const getRolIcon = () => {
    const rol = getUserRole();
    switch(rol) {
      case 'ceo': return '👑';
      case 'director': return '📊';
      case 'lider': return '⭐';
      default: return '👤';
    }
  };

  // ============================================================
  // 5. FUNCIÓN PARA OBTENER COLOR DEL ROL
  // ============================================================
  const getRolColor = () => {
    const rol = getUserRole();
    switch(rol) {
      case 'ceo': return '#F1C40F';
      case 'director': return '#E67E22';
      case 'lider': return '#3498DB';
      default: return '#2ECC71';
    }
  };

  // ============================================================
  // 6. MANEJADOR DE LOGO CLICK
  // ============================================================
  const handleLogoClick = (e) => {
    e.preventDefault();
    const route = getHomeRoute();
    navigate(route);
  };

  const userRole = getUserRole();
  const rolNombre = getRolNombre();
  const rolIcon = getRolIcon();
  const rolColor = getRolColor();

  return (
    <header className="dashboard-header">
      <div className="header-left">
        <div className="logo-section">
          <button onClick={handleLogoClick} className="logo-link" title="Ir al inicio">
            <FaBuilding className="header-logo-icon" />
            <span className="logo-text">NEXUS</span>
          </button>
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
        {/* Badge de rol del usuario */}
        <div className="user-role-badge" style={{ backgroundColor: rolColor }}>
          <span className="role-icon">{rolIcon}</span>
          <span className="role-name">{rolNombre}</span>
        </div>

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

      {/* Estilos adicionales para el badge de rol */}
     
    
    </header>
  );
}

export default HeaderInt;