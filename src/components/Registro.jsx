import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { db, doc, setDoc } from '../services/firebase/Firebase';
import '../Estilos/Registro.css';

function Registro() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // ✅ Estado del plan seleccionado 
  const [planSeleccionado, setPlanSeleccionado] = useState(null);
  
  const [loading, setLoading] = useState(false);
  const [mostrarPago, setMostrarPago] = useState(false);
  const [codigoPago, setCodigoPago] = useState('');
  const [empresa, setEmpresa] = useState({
    nit: '',
    nombre: '',
    cantidades: {
      ceo: 1,
      directores: 0,
      lideres: 0,
      empleados: 0
    }
  });

  const [mensaje, setMensaje] = useState({ texto: '', tipo: '' });
  const [paso, setPaso] = useState(1);

  // ✅ Recibir plan seleccionado desde Precios.jsx
  useEffect(() => {
    if (location.state?.planSeleccionado) {
      setPlanSeleccionado(location.state.planSeleccionado);
    } else {
      // Si no hay plan seleccionado, redirigir a Precios
      navigate('/precios');
    }
  }, [location, navigate]);

  // ===== MANEJADORES DE DATOS =====
  const handleEmpresaChange = (e) => {
    const { name, value } = e.target;
    setEmpresa({ ...empresa, [name]: value });
  };

  const handleNitChange = (e) => {
    const value = e.target.value;
    const filteredValue = value.replace(/[^0-9-]/g, '');
    setEmpresa({ ...empresa, nit: filteredValue });
  };

  const handleCantidadChange = (e) => {
    const { name, value } = e.target;
    const cantidad = parseInt(value) || 0;
    
    // ✅ Validar que no exceda el límite del plan
    const totalActual = empresa.cantidades.ceo + empresa.cantidades.directores + 
                        empresa.cantidades.lideres + empresa.cantidades.empleados;
    const nuevoTotal = totalActual - empresa.cantidades[name] + cantidad;
    
    if (planSeleccionado && nuevoTotal > planSeleccionado.max_usuarios) {
      setMensaje({ 
        texto: `❌ El plan ${planSeleccionado.nombre} solo permite hasta ${planSeleccionado.max_usuarios} usuarios`, 
        tipo: 'error' 
      });
      return;
    }
    
    setEmpresa({
      ...empresa,
      cantidades: { ...empresa.cantidades, [name]: cantidad }
    });
    setMensaje({ texto: '', tipo: '' });
  };

  const handleCodigoChange = (e) => {
    const value = e.target.value;
    const filteredValue = value.replace(/[^0-9]/g, '');
    setCodigoPago(filteredValue);
  };

  // ===== VALIDACIONES =====
  const validarPaso1 = () => {
    if (!empresa.nit.trim()) {
      setMensaje({ texto: '❌ El NIT es obligatorio', tipo: 'error' });
      return false;
    }
    if (!empresa.nombre.trim()) {
      setMensaje({ texto: '❌ El nombre de la empresa es obligatorio', tipo: 'error' });
      return false;
    }
    setMensaje({ texto: '', tipo: '' });
    return true;
  };

  const validarPaso2 = () => {
    if (empresa.cantidades.ceo < 1) {
      setMensaje({ texto: '❌ Debe haber al menos 1 CEO', tipo: 'error' });
      return false;
    }
    
    // ✅ Validar que el total no exceda el límite del plan
    const total = empresa.cantidades.ceo + empresa.cantidades.directores + 
                  empresa.cantidades.lideres + empresa.cantidades.empleados;
    
    if (planSeleccionado && total > planSeleccionado.max_usuarios) {
      setMensaje({ 
        texto: `❌ El plan ${planSeleccionado.nombre} solo permite hasta ${planSeleccionado.max_usuarios} usuarios. Actualmente tienes ${total}`, 
        tipo: 'error' 
      });
      return false;
    }
    
    setMensaje({ texto: '', tipo: '' });
    return true;
  };

  // ===== FUNCIÓN PARA CREAR EMPRESA =====
  const crearEmpresa = async () => {
    setLoading(true);
    setMensaje({ texto: '📡 Creando empresa en la base de datos...', tipo: 'info' });

    try {
      const empresaId = `emp_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
      const totalUsuariosPlan = empresa.cantidades.ceo + empresa.cantidades.directores + 
                                  empresa.cantidades.lideres + empresa.cantidades.empleados;

      const nuevaEmpresa = {
        id: empresaId,
        nombre: empresa.nombre,
        nit: empresa.nit,
        plan_id: planSeleccionado?.id || 'plan_basico',
        plan_nombre: planSeleccionado?.nombre || 'Básico',
        max_usuarios: planSeleccionado?.max_usuarios || 10,  // ✅ LÍMITE DEL PLAN
        usuarios_actuales: 0,  // Se actualizará al registrar CEO
        estructura: {
          ceo: empresa.cantidades.ceo,
          directores: empresa.cantidades.directores,
          lideres: empresa.cantidades.lideres,
          empleados: empresa.cantidades.empleados
        },
        estado: 'activa',
        fecha_creacion: new Date(),
        created_at: new Date()
      };

      await setDoc(doc(db, 'empresas', empresaId), nuevaEmpresa);

      const empresaCreada = {
        id: empresaId,
        nombre: empresa.nombre,
        nit: empresa.nit,
        max_usuarios: nuevaEmpresa.max_usuarios,
        ...nuevaEmpresa
      };

      setMensaje({ texto: '✅ Empresa creada exitosamente', tipo: 'success' });
      return empresaCreada;

    } catch (error) {
      console.error('Error al crear empresa:', error);
      setMensaje({ texto: '❌ Error al crear la empresa. Intenta nuevamente.', tipo: 'error' });
      return null;
    } finally {
      setLoading(false);
    }
  };

  // ===== VERIFICAR PAGO Y CREAR EMPRESA =====
  const verificarPagoYCrearEmpresa = async () => {
    if (codigoPago === '12345') {
      const empresaCreada = await crearEmpresa();
      
      if (empresaCreada) {
        navigate('/UserRegister', {
          state: {
            empresaData: {
              id: empresaCreada.id,
              nombre: empresaCreada.nombre,
              nit: empresaCreada.nit,
              max_usuarios: empresaCreada.max_usuarios,
              plan_id: planSeleccionado?.id,
              plan_nombre: planSeleccionado?.nombre
            }
          }
        });
      }
    } else {
      setMensaje({ texto: '❌ Código de pago incorrecto. Intenta con 12345', tipo: 'error' });
      setTimeout(() => setMensaje({ texto: '', tipo: '' }), 3000);
    }
  };

  // ===== MANEJADORES DE NAVEGACIÓN =====
  const siguientePaso = () => {
    if (validarPaso1()) setPaso(2);
  };

  const pasoAnterior = () => {
    setPaso(1);
    setMensaje({ texto: '', tipo: '' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validarPaso2()) return;
    setMostrarPago(true);
  };

  const totalUsuarios = empresa.cantidades.ceo + empresa.cantidades.directores + 
                        empresa.cantidades.lideres + empresa.cantidades.empleados;

  // ✅ Mostrar información del plan seleccionado
  if (!planSeleccionado) {
    return <div className="loading-container">Cargando información del plan...</div>;
  }

  // ===== PANTALLA DE PAGO =====
  if (mostrarPago) {
    return (
      <div className="pago-container">
        <div className="pago-card">
          <h1 className="pago-titulo">💳 PAGO</h1>
          
          <div className="pago-mensaje">
            <p>Para validar el pago ingresa el código:</p>
            <strong className="codigo-ejemplo">12345</strong>
          </div>

          {mensaje.texto && (
            <div className={`mensaje ${mensaje.tipo}`}>
              {mensaje.texto}
            </div>
          )}

          <input
            type="text"
            className="pago-input"
            value={codigoPago}
            onChange={handleCodigoChange}
            placeholder="Ingrese el código aquí"
            maxLength="5"
            autoFocus
          />

          <button 
            className="pago-btn-validar" 
            onClick={verificarPagoYCrearEmpresa}
            disabled={loading}
          >
            {loading ? 'Creando empresa...' : 'Validar Pago y Crear Empresa'}
          </button>

          <button 
            className="pago-btn-volver" 
            onClick={() => setMostrarPago(false)}
          >
            ← Volver al formulario
          </button>
        </div>
      </div>
    );
  }

  // ===== FORMULARIO PRINCIPAL =====
  return (
    <div className="config-empresa-container">
      <div className="config-header">
        <h1>Configuración de Empresa</h1>
        <p>Completa los datos para crear tu espacio de trabajo</p>
      </div>

      {/* ✅ Tarjeta informativa del plan seleccionado */}
      <div className="plan-info-card">
        <div className="plan-info-header">
          <span className="plan-badge">📦 {planSeleccionado.nombre}</span>
          <span className="plan-limite-info">Máximo {planSeleccionado.max_usuarios} usuarios</span>
        </div>
        <div className="plan-progress-info">
          <span>Usuarios configurados: {totalUsuarios} / {planSeleccionado.max_usuarios}</span>
          <div className="progress-bar-mini">
            <div 
              className="progress-fill" 
              style={{ 
                width: `${(totalUsuarios / planSeleccionado.max_usuarios) * 100}%`,
                backgroundColor: totalUsuarios > planSeleccionado.max_usuarios ? '#e74c3c' : '#27ae60'
              }}
            ></div>
          </div>
        </div>
      </div>

      <div className="progreso">
        <div className={`paso ${paso >= 1 ? 'activo' : ''}`}>
          <span className="numero">1</span>
          <span className="texto">Datos de empresa</span>
        </div>
        <div className={`linea ${paso >= 2 ? 'activa' : ''}`}></div>
        <div className={`paso ${paso >= 2 ? 'activo' : ''}`}>
          <span className="numero">2</span>
          <span className="texto">Estructura organizacional</span>
        </div>
      </div>

      {mensaje.texto && (
        <div className={`mensaje ${mensaje.tipo}`}>
          {mensaje.texto}
        </div>
      )}

      <form onSubmit={handleSubmit} className="config-form">
        {paso === 1 && (
          <div className="paso-contenido">
            <h2>Información de la empresa</h2>
            
            <div className="campo">
              <label>NIT <span className="requerido">*</span></label>
              <input
                type="text"
                name="nit"
                value={empresa.nit}
                onChange={handleNitChange}
                placeholder="Ej: 900123456-7"
                className="input-text"
                required
              />
            </div>

            <div className="campo">
              <label>Nombre de la empresa <span className="requerido">*</span></label>
              <input
                type="text"
                name="nombre"
                value={empresa.nombre}
                onChange={handleEmpresaChange}
                placeholder="Ej: Mi Empresa S.A.S."
                className="input-text"
                required
              />
            </div>

            <div className="botones-navegacion">
              <button type="button" onClick={siguientePaso} className="btn-primario">
                Siguiente →
              </button>
            </div>
          </div>
        )}

        {paso === 2 && (
          <div className="paso-contenido">
            <h2>Estructura de tu equipo</h2>
            <p className="subtitulo">Define cuántas personas habrá en cada nivel (Máximo: {planSeleccionado.max_usuarios} usuarios)</p>

            <div className="grid-roles">
              <div className="rol-card">
                <div className="rol-header ceo">👑 CEO</div>
                <input
                  type="number"
                  name="ceo"
                  min="1"
                  value={empresa.cantidades.ceo}
                  onChange={handleCantidadChange}
                  className="input-number"
                />
                <small>Máximo 1 (tú)</small>
              </div>

              <div className="rol-card">
                <div className="rol-header director">📊 Directores</div>
                <input
                  type="number"
                  name="directores"
                  min="0"
                  value={empresa.cantidades.directores}
                  onChange={handleCantidadChange}
                  className="input-number"
                />
                <small>Jefes de área</small>
              </div>

              <div className="rol-card">
                <div className="rol-header lider">👥 Líderes</div>
                <input
                  type="number"
                  name="lideres"
                  min="0"
                  max={planSeleccionado.max_usuarios}
                  value={empresa.cantidades.lideres}
                  onChange={handleCantidadChange}
                  className="input-number"
                />
                <small>Líderes de equipo</small>
              </div>

              <div className="rol-card">
                <div className="rol-header empleado">👤 Empleados</div>
                <input
                  type="number"
                  name="empleados"
                  min="0"
                  max={planSeleccionado.max_usuarios}
                  value={empresa.cantidades.empleados}
                  onChange={handleCantidadChange}
                  className="input-number"
                />
                <small>Personal operativo</small>
              </div>
            </div>

            <div className="resumen">
              <h3>Resumen</h3>
              <p>Total de usuarios: <strong>{totalUsuarios}</strong></p>
              <p>Límite del plan: <strong>{planSeleccionado.max_usuarios}</strong></p>
              {totalUsuarios > planSeleccionado.max_usuarios && (
                <p className="error-resumen">⚠️ Has superado el límite del plan</p>
              )}
            </div>

            <div className="botones-navegacion">
              <button type="button" onClick={pasoAnterior} className="btn-secundario">
                ← Atrás
              </button>
              <button 
                type="submit" 
                className="btn-primario btn-crear"
                disabled={totalUsuarios > planSeleccionado.max_usuarios}
              >
                Continuar al Pago
              </button>
            </div>
          </div>
        )}
      
        <div/>
    
    
      </form>
    </div>
  );
}

export default Registro;