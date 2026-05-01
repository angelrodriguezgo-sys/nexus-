import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Importar useNavigate
import '../Estilos/Registro.css'; 

function Registro() {
  const navigate = useNavigate(); // Hook para navegación

  // ===== ESTADOS =====
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
  const [mostrarPago, setMostrarPago] = useState(false);
  const [codigoPago, setCodigoPago] = useState('');

  // ===== MANEJADORES DE CAMBIOS =====
  const handleEmpresaChange = (e) => {
    const { name, value } = e.target;
    setEmpresa({
      ...empresa,
      [name]: value
    });
  };

  const handleNitChange = (e) => {
    const value = e.target.value;
    const filteredValue = value.replace(/[^0-9-]/g, '');
    setEmpresa({
      ...empresa,
      nit: filteredValue
    });
  };

  const handleCantidadChange = (e) => {
    const { name, value } = e.target;
    const cantidad = parseInt(value) || 0;
    
    setEmpresa({
      ...empresa,
      cantidades: {
        ...empresa.cantidades,
        [name]: cantidad
      }
    });
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
    const total = empresa.cantidades.ceo + 
                  empresa.cantidades.directores + 
                  empresa.cantidades.lideres + 
                  empresa.cantidades.empleados;
    
    if (total === 0) {
      setMensaje({ texto: '❌ Debe haber al menos 1 persona en la empresa', tipo: 'error' });
      return false;
    }
    
    if (empresa.cantidades.ceo < 1) {
      setMensaje({ texto: '❌ Debe haber al menos 1 CEO', tipo: 'error' });
      return false;
    }
    
    setMensaje({ texto: '', tipo: '' });
    return true;
  };

  // ===== NAVEGACIÓN =====
  const siguientePaso = () => {
    if (validarPaso1()) {
      setPaso(2);
    }
  };

  const pasoAnterior = () => {
    setPaso(1);
    setMensaje({ texto: '', tipo: '' });
  };

  // ===== PAGO =====
  const handleCodigoChange = (e) => {
    const value = e.target.value;
    const filteredValue = value.replace(/[^0-9]/g, '');
    setCodigoPago(filteredValue);
  };

  const verificarPago = () => {
    if (codigoPago === '12345') {
      // Primero mostrar alerta de éxito
      alert('✅ Pago confirmado. ¡Tu empresa ha sido configurada!');
      
      // Ocultar pantalla de pago
      setMostrarPago(false);
      setCodigoPago('');
      
      // Mostrar alerta indicando que falta registrarse
      alert('⚠️ Solo falta que te registres como usuario para completar el proceso.');
      
      // Redirigir al registro
      navigate('/register');
      
      // Resetear el formulario
      setPaso(1);
      setEmpresa({
        nit: '',
        nombre: '',
        cantidades: {
          ceo: 1,
          directores: 0,
          lideres: 0,
          empleados: 0
        }
      });
    } else {
      alert('❌ Error de pago. El código ingresado es incorrecto. Intenta con 12345');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validarPaso2()) return;
    setMostrarPago(true);
  };

  const totalUsuarios = empresa.cantidades.ceo + 
                        empresa.cantidades.directores + 
                        empresa.cantidades.lideres + 
                        empresa.cantidades.empleados;

  // ===== PANTALLA DE PAGO =====
  if (mostrarPago) {
    return (
      <div className="pago-container">
        <div className="pago-card">
          <h1 className="pago-titulo">PAGO</h1>
          
          <div className="pago-mensaje">
            <p>para validar el pago ingrese :</p>
            <strong className="codigo-ejemplo">12345</strong>
          </div>

          <input
            type="text"
            className="pago-input"
            value={codigoPago}
            onChange={handleCodigoChange}
            placeholder="Ingrese el código aquí"
            maxLength="5"
            autoFocus
          />

          <button className="pago-btn-validar" onClick={verificarPago}>
            Validar Pago
          </button>

          <button className="pago-btn-volver" onClick={() => setMostrarPago(false)}>
            ← Volver al formulario
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="config-empresa-container">
      <div className="config-header">
        <h1>Configuración de Empresa</h1>
        <p>Completa los datos para crear tu espacio de trabajo</p>
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
              <label>
                NIT <span className="requerido">*</span>
              </label>
              <input
                type="text"
                name="nit"
                value={empresa.nit}
                onChange={handleNitChange}
                placeholder="Ej: 9001234567 o 900123456-7"
                className="input-text"
              />
              <small>Solo números y guiones - Ejemplo: 900123456-7</small>
            </div>

            <div className="campo">
              <label>
                Nombre de la empresa <span className="requerido">*</span>
              </label>
              <input
                type="text"
                name="nombre"
                value={empresa.nombre}
                onChange={handleEmpresaChange}
                placeholder="Ej: Mi Empresa S.A.S."
                className="input-text"
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
            <p className="subtitulo">Define cuántas personas habrá en cada nivel</p>

            <div className="grid-roles">
              <div className="rol-card">
                <div className="rol-header ceo">
                  <span className="rol-icon">👑</span>
                  <span className="rol-nombre">CEO</span>
                </div>
                <div className="rol-input">
                  <input
                    type="number"
                    name="ceo"
                    min="1"
                    max="10"
                    value={empresa.cantidades.ceo}
                    onChange={handleCantidadChange}
                    className="input-number"
                  />
                </div>
                <small>Máxima autoridad (mínimo 1)</small>
              </div>

              <div className="rol-card">
                <div className="rol-header director">
                  <span className="rol-icon">📊</span>
                  <span className="rol-nombre">Directores</span>
                </div>
                <div className="rol-input">
                  <input
                    type="number"
                    name="directores"
                    min="0"
                    max="50"
                    value={empresa.cantidades.directores}
                    onChange={handleCantidadChange}
                    className="input-number"
                  />
                </div>
                <small>Jefes de área</small>
              </div>

              <div className="rol-card">
                <div className="rol-header lider">
                  <span className="rol-icon">👥</span>
                  <span className="rol-nombre">Líderes</span>
                </div>
                <div className="rol-input">
                  <input
                    type="number"
                    name="lideres"
                    min="0"
                    max="100"
                    value={empresa.cantidades.lideres}
                    onChange={handleCantidadChange}
                    className="input-number"
                  />
                </div>
                <small>Líderes de equipo</small>
              </div>

              <div className="rol-card">
                <div className="rol-header empleado">
                  <span className="rol-icon">👤</span>
                  <span className="rol-nombre">Empleados</span>
                </div>
                <div className="rol-input">
                  <input
                    type="number"
                    name="empleados"
                    min="0"
                    max="500"
                    value={empresa.cantidades.empleados}
                    onChange={handleCantidadChange}
                    className="input-number"
                  />
                </div>
                <small>Personal operativo</small>
              </div>
            </div>

            <div className="resumen">
              <h3>Resumen de la estructura</h3>
              <div className="resumen-grid">
                <div className="resumen-item">
                  <span className="resumen-label">Total de usuarios:</span>
                  <span className="resumen-valor">{totalUsuarios} </span>
                </div>
                <div className="resumen-item">
                  <span className="resumen-label">CEO:</span>
                  <span className="resumen-valor">{empresa.cantidades.ceo}</span>
                </div>
                <div className="resumen-item">
                  <span className="resumen-label">Directores:</span>
                  <span className="resumen-valor">{empresa.cantidades.directores}</span>
                </div>
                <div className="resumen-item">
                  <span className="resumen-label">Líderes:</span>
                  <span className="resumen-valor">{empresa.cantidades.lideres}</span>
                </div>
                <div className="resumen-item">
                  <span className="resumen-label">Empleados:</span>
                  <span className="resumen-valor">{empresa.cantidades.empleados}</span>
                </div>
              </div>
            </div>

            <div className="botones-navegacion">
              <button type="button" onClick={pasoAnterior} className="btn-secundario">
                ← Atrás
              </button>
              <button type="submit" className="btn-primario btn-crear">
                💳 Crear Empresa
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}

export default Registro;