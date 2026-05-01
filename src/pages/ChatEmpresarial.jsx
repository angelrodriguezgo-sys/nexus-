import '../Estilos/ChatEmpresarial.css';
import React, { useState, useEffect, useRef } from 'react';

const ChatEmpresarial = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [usuarioActual, setUsuarioActual] = useState(null);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const [mensajes, setMensajes] = useState([]);
  const [nuevoMensaje, setNuevoMensaje] = useState('');
  const [error, setError] = useState('');
  const messagesEndRef = useRef(null);

  // Rangos disponibles (de mayor a menor)
  const rangos = [
    { nombre: 'SuperAdmin', nivel: 5, color: '#FFD700' },
    { nombre: 'Admin', nivel: 4, color: '#FF6B6B' },
    { nombre: 'Moderador', nivel: 3, color: '#4ECDC4' },
    { nombre: 'UsuarioVIP', nivel: 2, color: '#95E77E' },
    { nombre: 'Usuario', nivel: 1, color: '#FFFFFF' }
  ];

  // Usuario actual (logueado automáticamente)
  const usuarioAutomatico = {
    id: 1,
    email: 'superadmin@chat.com',
    nombre: 'Juan Super',
    rango: 'SuperAdmin',
    rangoNivel: 5,
    online: true
  };

  // Datos iniciales de usuarios
  useEffect(() => {
    const usuariosIniciales = [
      { id: 1, email: 'superadmin@chat.com', nombre: 'Juan Super', rango: 'SuperAdmin', rangoNivel: 5, online: true },
      { id: 2, email: 'admin@chat.com', nombre: 'Maria Admin', rango: 'Admin', rangoNivel: 4, online: true },
      { id: 3, email: 'moderador@chat.com', nombre: 'Carlos Mod', rango: 'Moderador', rangoNivel: 3, online: false },
      { id: 4, email: 'vip@chat.com', nombre: 'Ana VIP', rango: 'UsuarioVIP', rangoNivel: 2, online: true },
      { id: 5, email: 'usuario@chat.com', nombre: 'Luis User', rango: 'Usuario', rangoNivel: 1, online: true }
    ];
    setUsuarios(usuariosIniciales);
    setUsuarioActual(usuarioAutomatico);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [mensajes]);

  const getRangoColor = (rangoNombre) => {
    const rango = rangos.find(r => r.nombre === rangoNombre);
    return rango ? rango.color : '#FFFFFF';
  };

  const puedeEscribir = (usuarioActualNivel, usuarioTargetNivel) => {
    return usuarioActualNivel >= usuarioTargetNivel;
  };

  const enviarMensaje = (e) => {
    e.preventDefault();
    if (!nuevoMensaje.trim()) {
      setError('✏️ Escribe un mensaje antes de enviar');
      return;
    }
    if (!usuarioSeleccionado) {
      setError('👥 Selecciona un usuario para chatear');
      return;
    }

    const mensaje = {
      id: Date.now(),
      de: usuarioActual.id,
      deNombre: usuarioActual.nombre,
      deRango: usuarioActual.rango,
      para: usuarioSeleccionado.id,
      paraNombre: usuarioSeleccionado.nombre,
      texto: nuevoMensaje,
      timestamp: new Date().toLocaleTimeString(),
      fecha: new Date().toLocaleDateString()
    };

    setMensajes([...mensajes, mensaje]);
    setNuevoMensaje('');
    setError('');
  };

  const getUsuariosDisponibles = () => {
    if (!usuarioActual) return [];
    return usuarios.filter(user => 
      user.id !== usuarioActual.id && 
      puedeEscribir(usuarioActual.rangoNivel, user.rangoNivel)
    );
  };

  if (!usuarioActual) {
    return (
      <div className="chat-loading">
        <div className="chat-loading-spinner"></div>
        <p>Cargando chat empresarial...</p>
      </div>
    );
  }

  const usuariosDisponibles = getUsuariosDisponibles();

  return (
    <div className="chat-main-container">
      {/* Sidebar - Lista de usuarios */}
      <div className="chat-sidebar">
        <div className="chat-user-profile">
          <div className="chat-user-avatar">
            {usuarioActual.nombre.charAt(0).toUpperCase()}
          </div>
          <div className="chat-user-info">
            <h3>{usuarioActual.nombre}</h3>
            <p style={{ color: getRangoColor(usuarioActual.rango) }}>
              {usuarioActual.rango}
            </p>
          </div>
        </div>

        <div className="chat-users-list">
          <h4>👥 Contactos disponibles</h4>
          <p className="chat-rule-info">
            ⚡ Puedes chatear con usuarios de mismo rango o inferior
          </p>
          
          {usuariosDisponibles.length === 0 ? (
            <p className="chat-no-users">😕 No hay usuarios disponibles para chatear</p>
          ) : (
            usuariosDisponibles.map(user => (
              <div
                key={user.id}
                className={`chat-user-item ${usuarioSeleccionado?.id === user.id ? 'selected' : ''}`}
                onClick={() => {
                  setUsuarioSeleccionado(user);
                  setError('');
                }}
              >
                <div className="chat-user-status">
                  <span className={`status-dot ${user.online ? 'online' : 'offline'}`}></span>
                </div>
                <div className="chat-user-details">
                  <span className="chat-user-name">{user.nombre}</span>
                  <span className="chat-user-rango" style={{ color: getRangoColor(user.rango) }}>
                    {user.rango}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Área de chat */}
      <div className="chat-area">
        {!usuarioSeleccionado ? (
          <div className="chat-placeholder">
            <div className="chat-placeholder-icon">💬</div>
            <h3>Selecciona un contacto</h3>
            <p>Elige un usuario del panel izquierdo para comenzar a chatear</p>
            <p className="chat-rule-placeholder">
              Recuerda: solo puedes chatear con usuarios del mismo rango o inferior
            </p>
          </div>
        ) : (
          <>
            {/* Header del chat */}
            <div className="chat-header">
              <div className="chat-header-info">
                <span className="chat-header-name">{usuarioSeleccionado.nombre}</span>
                <span className="chat-header-rango" style={{ color: getRangoColor(usuarioSeleccionado.rango) }}>
                  {usuarioSeleccionado.rango}
                </span>
              </div>
              <div className="chat-header-status">
                <span className={`status-dot ${usuarioSeleccionado.online ? 'online' : 'offline'}`}></span>
                <span>{usuarioSeleccionado.online ? 'En línea' : 'Desconectado'}</span>
              </div>
            </div>

            {/* Mensajes */}
            <div className="chat-messages">
              {mensajes
                .filter(m => 
                  (m.de === usuarioActual.id && m.para === usuarioSeleccionado.id) ||
                  (m.de === usuarioSeleccionado.id && m.para === usuarioActual.id)
                )
                .map(mensaje => (
                  <div
                    key={mensaje.id}
                    className={`chat-message ${mensaje.de === usuarioActual.id ? 'sent' : 'received'}`}
                  >
                    <div className="message-bubble">
                      <div className="message-header">
                        <span className="message-name">{mensaje.deNombre}</span>
                        <span className="message-rango" style={{ color: getRangoColor(mensaje.deRango) }}>
                          {mensaje.deRango}
                        </span>
                      </div>
                      <p className="message-text">{mensaje.texto}</p>
                      <div className="message-time">
                        🕐 {mensaje.timestamp} - 📅 {mensaje.fecha}
                      </div>
                    </div>
                  </div>
                ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Mostrar error en el área de chat si existe */}
            {error && <div className="chat-error-message">{error}</div>}

            {/* Input de mensaje */}
            <form onSubmit={enviarMensaje} className="chat-input-area">
              <input
                type="text"
                value={nuevoMensaje}
                onChange={(e) => setNuevoMensaje(e.target.value)}
                placeholder={`✏️ Escribe un mensaje para ${usuarioSeleccionado.nombre}...`}
                className="chat-input"
              />
              <button type="submit" className="chat-send-btn">
                📤 Enviar
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default ChatEmpresarial;