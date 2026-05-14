import '../Estilos/ChatEmpresarial.css';
import React, { useState, useEffect, useRef } from 'react';import { useAuth } from '../context/AuthContext';import HeaderInt from '../components/HeaderInt';
import { db } from '../services/firebase/Firebase';
import { collection, addDoc, onSnapshot, query, where, orderBy, serverTimestamp } from 'firebase/firestore';

const ChatEmpresarial = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [usuarioActual, setUsuarioActual] = useState(null);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const [mensajes, setMensajes] = useState([]);
  const [nuevoMensaje, setNuevoMensaje] = useState('');
  const [error, setError] = useState('');
  const [conversationId, setConversationId] = useState(null);
  const [unsubscribe, setUnsubscribe] = useState(null);
  const messagesEndRef = useRef(null);

  const { empresa } = useAuth();

  // Datos de empresa para HeaderInt
  const empresaData = {
    nombre: empresa?.nombre || 'MI EMPRESA S.A.S.',
    nit: empresa?.nit || '900.123.456-7'
  };

  // Determinar el rol del usuario actual para HeaderInt
  const userRole = usuarioActual?.rango || 'CEO';
  const rangos = [
    { nombre: 'CEO', nivel: 5, color: '#FFD700' },
    { nombre: 'Director', nivel: 4, color: '#F59E0B' },
    { nombre: 'Líder', nivel: 3, color: '#3B82F6' },
    { nombre: 'Empleado', nivel: 2, color: '#10B981' }
  ];

  // Usuario actual (logueado automáticamente)
  const usuarioAutomatico = {
    id: 1,
    email: 'ceo@chat.com',
    nombre: 'Juan CEO',
    rango: 'CEO',
    rangoNivel: 5,
    online: true
  };

  // Datos iniciales de usuarios
  useEffect(() => {
    const usuariosIniciales = [
      { id: 1, email: 'ceo@chat.com', nombre: 'Juan CEO', rango: 'CEO', rangoNivel: 5, online: true },
      { id: 2, email: 'director@chat.com', nombre: 'María Director', rango: 'Director', rangoNivel: 4, online: true },
      { id: 3, email: 'lider@chat.com', nombre: 'Carlos Líder', rango: 'Líder', rangoNivel: 3, online: false },
      { id: 4, email: 'empleado1@chat.com', nombre: 'Ana Empleado', rango: 'Empleado', rangoNivel: 2, online: true },
      { id: 5, email: 'empleado2@chat.com', nombre: 'Luis Empleado', rango: 'Empleado', rangoNivel: 2, online: true }
    ];
    setUsuarios(usuariosIniciales);
    setUsuarioActual(usuarioAutomatico);
  }, []);

  // Listener para mensajes
  useEffect(() => {
    if (usuarioSeleccionado && usuarioActual) {
      // Limpiar listener anterior
      if (unsubscribe) {
        unsubscribe();
      }

      // Calcular conversationId
      const ids = [usuarioActual.id, usuarioSeleccionado.id].sort();
      const newConversationId = `${ids[0]}-${ids[1]}`;
      setConversationId(newConversationId);

      // Configurar listener
      const q = query(collection(db, 'conversations', newConversationId, 'messages'), orderBy('timestamp'));
      const unsub = onSnapshot(q, (querySnapshot) => {
        console.log('Mensajes actualizados:', querySnapshot.size);
        const msgs = [];
        querySnapshot.forEach((doc) => {
          msgs.push({ id: doc.id, ...doc.data() });
        });
        setMensajes(msgs);
      });
      setUnsubscribe(() => unsub);
    } else {
      // Si no hay usuario seleccionado, limpiar
      if (unsubscribe) {
        unsubscribe();
        setUnsubscribe(null);
      }
      setMensajes([]);
      setConversationId(null);
    }

    // Cleanup on unmount
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [usuarioSeleccionado, usuarioActual]);

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

  const puedeEscribir = (usuarioActualRango, usuarioTargetRango) => {
    if (!usuarioActualRango || !usuarioTargetRango) return false;

    if (usuarioActualRango === 'CEO' || usuarioActualRango === 'Director') {
      return true;
    }
    if (usuarioActualRango === 'Líder') {
      return ['Director', 'Líder', 'Empleado'].includes(usuarioTargetRango);
    }
    if (usuarioActualRango === 'Empleado') {
      return ['Líder', 'Empleado'].includes(usuarioTargetRango);
    }
    return false;
  };

  const enviarMensaje = async (e) => {
    e.preventDefault();
    if (!nuevoMensaje.trim()) {
      setError('✏️ Escribe un mensaje antes de enviar');
      return;
    }
    if (!usuarioSeleccionado || !conversationId) {
      setError('👥 Selecciona un usuario para chatear');
      return;
    }

    try {
      console.log('Enviando mensaje:', nuevoMensaje);
      await addDoc(collection(db, 'conversations', conversationId, 'messages'), {
        fromId: usuarioActual.id,
        fromName: usuarioActual.nombre,
        fromRango: usuarioActual.rango,
        toId: usuarioSeleccionado.id,
        toName: usuarioSeleccionado.nombre,
        text: nuevoMensaje,
        timestamp: serverTimestamp()
      });
      console.log('Mensaje enviado exitosamente');
      setNuevoMensaje('');
      setError('');
    } catch (err) {
      console.error('Error al enviar mensaje:', err);
      setError('Error al enviar mensaje');
    }
  };

  const getUsuariosDisponibles = () => {
    if (!usuarioActual) return [];
    return usuarios.filter(user => 
      user.id !== usuarioActual.id && 
      puedeEscribir(usuarioActual.rango, user.rango)
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
    <>
      <HeaderInt empresaData={empresaData} userRole={userRole} />
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
              Recuerda: CEO/Director hablan con todos; Líder con Directores, Líderes y Empleados; Empleado con Líderes y Empleados.
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
              {mensajes.map(mensaje => (
                <div
                  key={mensaje.id}
                  className={`chat-message ${mensaje.fromId === usuarioActual.id ? 'sent' : 'received'}`}
                >
                  <div className="message-bubble">
                    <div className="message-header">
                      <span className="message-name">{mensaje.fromName}</span>
                      <span className="message-rango" style={{ color: getRangoColor(mensaje.fromRango) }}>
                        {mensaje.fromRango}
                      </span>
                    </div>
                    <p className="message-text">{mensaje.text}</p>
                    <div className="message-time">
                      🕐 {mensaje.timestamp?.toDate().toLocaleTimeString()} - 📅 {mensaje.timestamp?.toDate().toLocaleDateString()}
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
    </>
  );
};

export default ChatEmpresarial;