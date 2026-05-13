import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { db, doc, getDoc } from '../services/firebase/Firebase';
import '../Estilos/Login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      // ✅ login ahora retorna el user directamente
      const user = await login(email, password);
      const uid = user.uid;
      console.log('UID del usuario:', uid);
      
      // Obtener datos del usuario desde Firestore
      const userDocRef = doc(db, 'usuarios', uid);
      const userDoc = await getDoc(userDocRef);
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const userRole = String(userData.rol || '').toLowerCase();
        const empresaId = userData.empresaId;
        const empresaNombre = userData.empresaNombre;
        
        console.log('Usuario encontrado:', { userRole, empresaId, empresaNombre });
        
        // ✅ Redirigir según el rol
        switch(userRole) {
          case 'ceo':
            navigate('/CeoPage', { state: { empresaId, empresaNombre, rol: userRole } });
            break;
          case 'director':
            navigate('/DirectorPage', { state: { empresaId, empresaNombre, rol: userRole } });
            break;
          case 'lider':
            navigate('/LiderPage', { state: { empresaId, empresaNombre, rol: userRole } });
            break;
          case 'empleado':
            navigate('/EmpleadoPage', { state: { empresaId, empresaNombre, rol: userRole } });
            break;
          default:
            navigate('/login');
        }
      } else {
        console.warn('Usuario no encontrado en Firestore');
        // ✅ Si es el primer login después de crear empresa, redirigir a completar perfil
        navigate('/completar-perfil', { state: { uid, email } });
      }
      
    } catch (err) {
      console.error('Error completo:', err);
      
      if (err.code === 'auth/user-not-found') {
        setError('❌ No existe una cuenta con este correo electrónico.');
      } else if (err.code === 'auth/wrong-password') {
        setError('❌ Contraseña incorrecta. Intenta nuevamente.');
      } else if (err.code === 'auth/invalid-credential') {
        setError('❌ Credenciales inválidas. Verifica tu email y contraseña.');
      } else if (err.code === 'auth/too-many-requests') {
        setError('❌ Demasiados intentos fallidos. Intenta más tarde.');
      } else {
        setError(`❌ Error al iniciar sesión: ${err.message || 'Intenta nuevamente'}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">Iniciar Sesión</h2>
        
        <form className="login-form" onSubmit={handleSubmit}>
          <input
            className="login-input"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />
          
          <input
            className="login-input"
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />
          
          <button className="login-btn" type="submit" disabled={loading}>
            {loading ? '⏳ Iniciando sesión...' : '🚪 Entrar'}
          </button>
          
          {error && <p className="login-error">{error}</p>}
        </form>
        
        <p className="login-Register">
          ¿No tienes cuenta? <Link to="/register">Regístrate aquí</Link>
        </p>
      </div>
    </div>
  );
}

export default Login; 