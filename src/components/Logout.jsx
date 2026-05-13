import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../Estilos/Logout.css';

function Logout() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      alert('Hubo un problema al cerrar sesión. Intenta nuevamente.');
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="logout-container">
      <div className="logout-card">
        <div className="logout-icon">🚪</div>
        <h2 className="logout-title">Cerrar Sesión</h2>
        <p className="logout-message">
          ¿Estás seguro de que deseas salir de tu cuenta?
        </p>
        <div className="logout-buttons">
          <button 
            className="logout-cancel-btn"
            onClick={() => navigate(-1)}
            disabled={isLoggingOut}
          >
            Cancelar
          </button>
          <button 
            className="logout-confirm-btn"
            onClick={handleLogout}
            disabled={isLoggingOut}
          >
            {isLoggingOut ? 'Cerrando sesión...' : 'Sí, cerrar sesión'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Logout;