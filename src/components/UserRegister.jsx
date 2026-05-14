import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import '../Estilos/Register.css';

function UserRegister() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [error, setError] = useState('');
  const [nit, setNit] = useState('');
  const [nombreEmpresa, setNombreEmpresa] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const empresaData = location.state?.empresaData;

  useEffect(() => {
    if (empresaData) {
      setNit(empresaData.nit || '');
      setNombreEmpresa(empresaData.nombre || '');
    }
  }, [empresaData]);

  // Función para validar NIT (solo números y guiones)
  const handleNitChange = (e) => {
    const value = e.target.value;
    const filteredValue = value.replace(/[^0-9-]/g, '');
    setNit(filteredValue);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
   
    // Validaciones
    if (!nombre.trim()) {
      setError('El nombre del CEO es obligatorio.');
      return;
    }
    if (!apellido.trim()) {
      setError('El apellido del CEO es obligatorio.');
      return;
    }
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
      await register(email, password, {
        nombre,
        apellido,
        rol: 'ceo',
        empresaId: empresaData?.id || null
      });
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
        <h2 className="register-title">Registro de Usuario</h2>
        <p className="register-subtitle">Completa tus datos para registrarte 
          <br/>
          <br/>
          Seras registrado como CEO por defecto
        </p>

        <form className="register-form" onSubmit={handleSubmit}>
         
          {/* Nombre */}
          <input
            className="register-input"
            type="text"
            placeholder="Nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />

          {/* Apellido */}
          <input
            className="register-input"
            type="text"
            placeholder="Apellido"
            value={apellido}
            onChange={(e) => setApellido(e.target.value)}
            required
          />

          {/* NIT empresa */}
          <input
            className="register-input"
            type="text"
            placeholder="NIT de la empresa (Ej: 900123456-7)"
            value={nit}
            onChange={handleNitChange}
            required
          />

          {/* Nombre empresa */}
          <input
            className="register-input"
            type="text"
            placeholder="Nombre de la empresa"
            value={nombreEmpresa}
            onChange={(e) => setNombreEmpresa(e.target.value)}
            required
          />

          {/* Email */}
          <input
            className="register-input"
            type="email"
            placeholder="Correo electrónico (Personal o de la empresa)"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
         
          {/* Contraseña */}
          <input
            className="register-input"
            type="password"
            placeholder="Contraseña (mínimo 6 caracteres)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {/* Confirmar Contraseña */}
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

export default UserRegister;