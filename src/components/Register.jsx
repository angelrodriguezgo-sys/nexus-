import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import '../Estilos/Register.css';

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [nit, setNit] = useState(''); // Estado para el NIT
  const [nombreEmpresa, setNombreEmpresa] = useState(''); // Estado para el nombre de la empresa
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Obtener datos del estado de navegación (si vienen del paso de pago)
  const { nit: nitFromState, nombreEmpresa: nombreEmpresaFromState } = location.state || {};

  // Si hay datos del estado, usarlos para prellenar los campos
  React.useEffect(() => {
    if (nitFromState) {
      setNit(nitFromState);
    }
    if (nombreEmpresaFromState) {
      setNombreEmpresa(nombreEmpresaFromState);
    }
  }, [nitFromState, nombreEmpresaFromState]);

  // Función para validar NIT (solo números y guiones)
  const handleNitChange = (e) => {
    const value = e.target.value;
    const filteredValue = value.replace(/[^0-9-]/g, '');
    setNit(filteredValue);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validaciones adicionales
    if (!nit.trim()) {
      setError('El NIT de la empresa es obligatorio.');
      return;
    }
    if (!nombreEmpresa.trim()) {
      setError('El nombre de la empresa es obligatorio.');
      return;
    }
    if (!email.trim()) {
      setError('El correo electrónico es obligatorio.');
      return;
    }
    if (!password.trim()) {
      setError('La contraseña es obligatoria.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }
    
    try {
      // Aquí puedes incluir los datos de la empresa en el registro
      await register(email, password, { nit, nombreEmpresa });
      alert('✅ Registro exitoso. Serás redirigido al inicio de sesión.');
      navigate('/login');
    } catch (err) {
      if (err.code === 'auth/email-already-in-use') {
        setError('❌ El email ya está registrado.');
      } else if (err.code === 'auth/weak-password') {
        setError('❌ La contraseña es demasiado débil. Usa al menos 6 caracteres.');
      } else {
        setError('❌ Error al registrar usuario. Intenta nuevamente.');
      }
      console.error(err);
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h2 className="register-title">Registro</h2>
        <p className="register-subtitle">Completa tus datos para registrarte</p>

        <form className="register-form" onSubmit={handleSubmit}>
          {/* Campo NIT de la empresa */}
          <input
            className="register-input"
            type="text"
            placeholder="NIT de la empresa (Ej: 900123456-7)"
            value={nit}
            onChange={handleNitChange}
            required
          />

          {/* Campo Nombre de la empresa */}
          <input
            className="register-input"
            type="text"
            placeholder="Nombre de la empresa"
            value={nombreEmpresa}
            onChange={(e) => setNombreEmpresa(e.target.value)}
            required
          />

          <input
            className="register-input"
            type="email"
            placeholder="Correo electrónico (Personal o de la empresa)"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          
          <input
            className="register-input"
            type="password"
            placeholder="Contraseña (mínimo 6 caracteres)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <input
            className="register-input"
            type="password"
            placeholder="Confirmar Contraseña"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <button className="register-btn" type="submit">Registrarse</button>

          {error && <p className="error-message">{error}</p>}
        </form>
        
        <p className="register-footer">
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;