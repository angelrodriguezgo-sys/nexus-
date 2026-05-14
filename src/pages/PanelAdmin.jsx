import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import HeaderInt from '../components/HeaderInt';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { firebaseConfig, auth, db, collection, addDoc, doc, updateDoc, getDocs, query, where, setDoc, deleteDoc } from '../services/firebase/Firebase';
import '../Estilos/PanelAdmin.css';

function PanelAdmin({ empresaData: empresaDataProp }) {
  const { empresa: authEmpresa, user: authUser } = useAuth();
  const location = useLocation();
  const empresaDataState = location.state?.empresaData;

  const [trabajadores, setTrabajadores] = useState([]);
  const [initialUserRole, setInitialUserRole] = useState(authUser?.rol || '');
  const userRoleLabel = initialUserRole ? initialUserRole.toUpperCase() : (authUser?.rol ? authUser.rol.toUpperCase() : 'ADMIN');
  const [loading, setLoading] = useState(false);
  const [registrando, setRegistrando] = useState(false);

  useEffect(() => {
    if (!initialUserRole && authUser?.rol) {
      setInitialUserRole(authUser.rol);
    }
  }, [authUser, initialUserRole]);

  // ✅ Datos de la empresa
  const [empresa, setEmpresa] = useState({
    id: empresaDataProp?.id || empresaDataState?.id || authEmpresa?.id || authUser?.empresa_id || 'empresa_001',
    nombre: empresaDataProp?.nombre || empresaDataState?.nombre || authEmpresa?.nombre || 'Mi Empresa',
    nit: empresaDataProp?.nit || empresaDataState?.nit || authEmpresa?.nit || '123456789',
    plan_id: empresaDataProp?.plan_id || empresaDataState?.plan_id || authEmpresa?.plan_id || 'plan_basico',
    max_usuarios: empresaDataProp?.max_usuarios || empresaDataState?.max_usuarios || authEmpresa?.max_usuarios || 10,
    usuarios_actuales: empresaDataProp?.usuarios_actuales || empresaDataState?.usuarios_actuales || authEmpresa?.usuarios_actuales || 0
  });

  useEffect(() => {
    const resolvedEmpresa = {
      id: empresaDataProp?.id || empresaDataState?.id || authEmpresa?.id || authUser?.empresa_id || 'empresa_001',
      nombre: empresaDataProp?.nombre || empresaDataState?.nombre || authEmpresa?.nombre || 'Mi Empresa',
      nit: empresaDataProp?.nit || empresaDataState?.nit || authEmpresa?.nit || '123456789',
      plan_id: empresaDataProp?.plan_id || empresaDataState?.plan_id || authEmpresa?.plan_id || 'plan_basico',
      max_usuarios: empresaDataProp?.max_usuarios || empresaDataState?.max_usuarios || authEmpresa?.max_usuarios || 10,
      usuarios_actuales: empresaDataProp?.usuarios_actuales || empresaDataState?.usuarios_actuales || authEmpresa?.usuarios_actuales || 0
    };
    setEmpresa(resolvedEmpresa);
  }, [empresaDataProp, empresaDataState, authEmpresa, authUser]);

  const [puedeAgregar, setPuedeAgregar] = useState(true);
  const [usuariosRestantes, setUsuariosRestantes] = useState(empresa.max_usuarios - empresa.usuarios_actuales);

  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    password: '',
    confirmPassword: '',
    telefono: '',
    cargo: '',
    departamento: '',
    rol: 'empleado',
    salario: '',
    fechaContratacion: '',
    estado: 'Activo',
    direccion: '',
  });

  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredTrabajadores, setFilteredTrabajadores] = useState(trabajadores);

  const DEFAULT_PASSWORD = '-123456';

  // ===== CARGAR TRABAJADORES DESDE FIRESTORE =====
  useEffect(() => {
    cargarTrabajadores();
  }, [empresa.id]);

  useEffect(() => {
    const filtered = trabajadores.filter(t =>
      t.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.cargo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.departamento?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredTrabajadores(filtered);
  }, [searchTerm, trabajadores]);

  const cargarTrabajadores = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'trabajadores'), where('empresaId', '==', empresa.id));
      const querySnapshot = await getDocs(q);
      const trabajadoresList = [];
      
      querySnapshot.forEach((doc) => {
        trabajadoresList.push({ id: doc.id, ...doc.data() });
      });
      
      setTrabajadores(trabajadoresList);
      setUsuariosRestantes(empresa.max_usuarios - trabajadoresList.length);
      setPuedeAgregar(trabajadoresList.length < empresa.max_usuarios);
      
    } catch (error) {
      console.error('Error al cargar trabajadores:', error);
    } finally {
      setLoading(false);
    }
  };

  // ===== REGISTRAR USUARIO EN FIREBASE AUTH + FIRESTORE =====
  const validarEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  };

  const registrarUsuarioEnFirebase = async (email, password, nombre, apellido, rol, telefono) => {
    try {
      const emailNormalizado = email.trim().toLowerCase();

      // 1. Crear o reutilizar una app secundaria para crear el usuario sin afectar la sesión actual
      let secondaryApp;
      try {
        secondaryApp = getApp('secondary');
      } catch (err) {
        secondaryApp = initializeApp(firebaseConfig, 'secondary');
      }
      const secondaryAuth = getAuth(secondaryApp);

      // 2. Crear usuario en Firebase Authentication con la app secundaria
      const userCredential = await createUserWithEmailAndPassword(secondaryAuth, emailNormalizado, password);
      const uid = userCredential.user.uid;

      // 3. Cerrar sesión de la app secundaria para no dejar la sesión secundaria activa
      await signOut(secondaryAuth);

      // 4. Guardar datos del usuario en Firestore (colección 'usuarios')
      await setDoc(doc(db, 'usuarios', uid), {
        uid: uid,
        nombre: nombre,
        apellido: apellido || '',
        email: email,
        telefono: telefono || '',
        rol: rol,
        empresa_id: empresa.id,
        empresaId: empresa.id,
        empresaNombre: empresa.nombre,
        empresaNIT: empresa.nit,
        estado: 'Activo',
        fechaRegistro: new Date().toISOString(),
        passwordDefault: password === DEFAULT_PASSWORD,
      });

      return { success: true, uid };
    } catch (error) {
      console.error('Error al registrar usuario:', error);
      if (error.code === 'auth/email-already-in-use') {
        throw new Error('El correo ya está registrado en el sistema');
      }
      throw error;
    }
  };

  // ===== GUARDAR TRABAJADOR =====
  const handleGuardar = async (e) => {
    e.preventDefault();
    
    if (editingId) {
      alert('⚠️ Estás editando un trabajador. Usa el botón Actualizar para guardar cambios.');
      return;
    }

    if (!puedeAgregar) {
      alert(`❌ Límite alcanzado. Tu plan solo permite ${empresa.max_usuarios} usuarios.`);
      return;
    }
    
    if (!formData.nombre || !formData.apellido || !formData.email) {
      alert('❌ Por favor completa los campos requeridos (Nombre, Apellido y Email)');
      return;
    }

    if (!validarEmail(formData.email)) {
      alert('❌ El email ingresado no tiene un formato válido.');
      return;
    }

    if (!formData.password) {
      alert('❌ Debes asignar una contraseña al nuevo empleado.');
      return;
    }
    if (formData.password.length < 6) {
      alert('❌ La contraseña debe tener al menos 6 caracteres.');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      alert('❌ Las contraseñas no coinciden.');
      return;
    }

    setRegistrando(true);
    
    try {
      // 1. Registrar en Firebase Authentication y Firestore
      const { uid } = await registrarUsuarioEnFirebase(
        formData.email,
        editingId ? (formData.password || DEFAULT_PASSWORD) : formData.password,
        formData.nombre,
        formData.apellido,
        formData.rol,
        formData.telefono
      );

      // 2. Guardar en colección 'trabajadores' (para gestión del panel)
      const trabajadorData = {
        uid: uid,
        nombre: formData.nombre,
        apellido: formData.apellido,
        email: formData.email,
        telefono: formData.telefono,
        cargo: formData.cargo,
        departamento: formData.departamento,
        rol: formData.rol,
        salario: formData.salario,
        fechaContratacion: formData.fechaContratacion,
        estado: 'Activo',
        direccion: formData.direccion,
        empresaId: empresa.id,
        empresaNombre: empresa.nombre,
        fecha_registro: new Date().toISOString(),
        passwordDefault: editingId ? false : (formData.password === DEFAULT_PASSWORD)
      };

      const docRef = await addDoc(collection(db, 'trabajadores'), trabajadorData);
      
      // 3. Actualizar estado local
      setTrabajadores([...trabajadores, { id: docRef.id, ...trabajadorData }]);
      handleLimpiar();
      
      alert(`✅ ¡Trabajador registrado exitosamente!\n📧 Email: ${formData.email}\n🔑 Contraseña: ${editingId ? 'Sin cambio' : formData.password}\n⚠️ Recomiende cambiar la contraseña en el primer inicio.`);
      
    } catch (error) {
      alert(`❌ Error: ${error.message}`);
    } finally {
      setRegistrando(false);
    }
  };

  // ===== ACTUALIZAR TRABAJADOR =====
  const handleActualizar = async (e) => {
    e.preventDefault();
    if (editingId === null) {
      alert('⚠️ Selecciona un trabajador para actualizar');
      return;
    }
    
    try {
      const trabajadorRef = doc(db, 'trabajadores', editingId);
      await updateDoc(trabajadorRef, {
        nombre: formData.nombre,
        apellido: formData.apellido,
        telefono: formData.telefono,
        cargo: formData.cargo,
        departamento: formData.departamento,
        rol: formData.rol,
        salario: formData.salario,
        fechaContratacion: formData.fechaContratacion,
        direccion: formData.direccion,
      });
      
      // También actualizar en colección 'usuarios'
      const trabajadorExistente = trabajadores.find(t => t.id === editingId);
      if (trabajadorExistente?.uid) {
        await updateDoc(doc(db, 'usuarios', trabajadorExistente.uid), {
          nombre: formData.nombre,
          apellido: formData.apellido,
          telefono: formData.telefono,
          rol: formData.rol,
        });
      }
      
      setTrabajadores(trabajadores.map(t =>
        t.id === editingId ? { ...t, ...formData } : t
      ));
      
      handleLimpiar();
      alert('✅ ¡Trabajador actualizado exitosamente!');
      
    } catch (error) {
      alert(`❌ Error al actualizar: ${error.message}`);
    }
  };

  // ===== ELIMINAR TRABAJADOR =====
  const handleEliminar = async () => {
    if (editingId === null) {
      alert('⚠️ Selecciona un trabajador para eliminar');
      return;
    }
    
    if (window.confirm('¿Estás seguro de que deseas eliminar este trabajador?')) {
      try {
        // Nota: Firebase Auth no permite eliminar usuarios fácilmente desde cliente
        // Se recomienda crear una Cloud Function para esto
        const trabajadorAEliminar = trabajadores.find(t => t.id === editingId);
        
        // Eliminar de colección 'trabajadores'
        await deleteDoc(doc(db, 'trabajadores', editingId));
        
        // Opcional: Marcar como inactivo en 'usuarios' en lugar de eliminar
        if (trabajadorAEliminar?.uid) {
          await updateDoc(doc(db, 'usuarios', trabajadorAEliminar.uid), {
            estado: 'Inactivo',
            fechaBaja: new Date().toISOString()
          });
        }
        
        setTrabajadores(trabajadores.filter(t => t.id !== editingId));
        handleLimpiar();
        alert('✅ ¡Trabajador eliminado exitosamente!');
        
      } catch (error) {
        alert(`❌ Error al eliminar: ${error.message}`);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLimpiar = () => {
    setFormData({
      nombre: '', apellido: '', email: '', password: '', confirmPassword: '', telefono: '', cargo: '', departamento: '',
      rol: 'empleado', salario: '', fechaContratacion: '', estado: 'Activo', direccion: '',
    });
    setEditingId(null);
  };

  const handleEditar = (trabajador) => {
    setFormData({
      nombre: trabajador.nombre,
      apellido: trabajador.apellido || '', 
      email: trabajador.email,
      password: '',
      confirmPassword: '',
      telefono: trabajador.telefono || '',
      cargo: trabajador.cargo || '', 
      departamento: trabajador.departamento || '', 
      rol: trabajador.rol?.toLowerCase() || 'empleado',
      salario: trabajador.salario || '', 
      fechaContratacion: trabajador.fechaContratacion || '',
      estado: trabajador.estado || 'Activo', 
      direccion: trabajador.direccion || '',
    });
    setEditingId(trabajador.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const stats = {
    total: trabajadores.length,
    activos: trabajadores.filter(t => t.estado === 'Activo').length,
    maxUsuarios: empresa.max_usuarios,
    disponibles: empresa.max_usuarios - trabajadores.length,
    porcentaje: (trabajadores.length / empresa.max_usuarios) * 100
  };

  return (
    <>
      <HeaderInt empresaData={empresa} userRole={initialUserRole || userRoleLabel} />
      <div className="panel-admin-container">
        
        <div className="panel-header">
          <h1>👨‍💼 Panel de Administración de Empleados</h1>
          <p>Gestión completa de empleados y personal - Empresa: {empresa.nombre}</p>
        </div>

        {/* Info del plan */}
        <div className="plan-info-card">
          <div className="plan-info-header">
            <span className="plan-badge">📦 {empresa.plan_id === 'plan_basico' ? 'Básico' : empresa.plan_id === 'plan_profesional' ? 'Profesional' : 'Empresarial'}</span>
            <span className={`plan-status ${stats.disponibles > 0 ? 'available' : 'full'}`}>
              {stats.disponibles > 0 ? `${stats.disponibles} cupos disponibles` : 'Sin cupos disponibles'}
            </span>
          </div>
          <div className="plan-progress">
            <div className="progress-bar" style={{ width: `${Math.min(stats.porcentaje, 100)}%`, backgroundColor: '#3498DB' }}></div>
          </div>
          <div className="plan-stats">
            <span>👥 Usuarios: {stats.total} / {stats.maxUsuarios}</span>
            <span>📊 Ocupación: {stats.porcentaje.toFixed(1)}%</span>
          </div>
        </div>

        {/* Tarjetas estadísticas */}
        <div className="panel-stats">
          <div className="stat-box stat-total"><h3>{stats.total}</h3><p>Trabajadores totales</p></div>
          <div className="stat-box stat-active"><h3>{stats.activos}</h3><p>Trabajadores activos</p></div>
          <div className="stat-box stat-inactive"><h3>{stats.disponibles}</h3><p>Cupos disponibles</p></div>
        </div>

        {/* Contenido principal */}
        <div className="panel-content">
          
          {/* Formulario */}
          <div className="panel-form-section">
            <div className="form-header">
              <h2>{editingId ? '✏️ Editar Trabajador' : '➕ Nuevo Trabajador'}</h2>
              {!puedeAgregar && <div className="limit-warning">⚠️ Límite de usuarios alcanzado</div>}
            </div>
            
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="form-row">
                <div className="form-group">
                  <label>Nombre *</label>
                  <input type="text" name="nombre" value={formData.nombre} onChange={handleInputChange} required disabled={registrando} />
                </div>
                <div className="form-group">
                  <label>Apellido *</label>
                  <input type="text" name="apellido" value={formData.apellido} onChange={handleInputChange} required disabled={registrando} />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Email *</label>
                  <input type="email" name="email" value={formData.email} onChange={handleInputChange} required disabled={editingId !== null || registrando} />
                  {editingId && <small className="warning">⚠️ El email no se puede modificar</small>}
                </div>
                <div className="form-group">
                  <label>Teléfono</label>
                  <input type="tel" name="telefono" value={formData.telefono} onChange={handleInputChange} />
                </div>
              </div>

              {!editingId && (
                <div className="form-row">
                  <div className="form-group">
                    <label>Contraseña *</label>
                    <input type="password" name="password" value={formData.password} onChange={handleInputChange} required disabled={registrando} />
                  </div>
                  <div className="form-group">
                    <label>Confirmar Contraseña *</label>
                    <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleInputChange} required disabled={registrando} />
                  </div>
                </div>
              )}

              <div className="form-row">
                <div className="form-group">
                  <label>Cargo</label>
                  <input type="text" name="cargo" value={formData.cargo} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                  <label>Departamento</label>
                  <select name="departamento" value={formData.departamento} onChange={handleInputChange}>
                    <option value="">-- Selecciona --</option>
                    <option>Administración</option><option>Recursos Humanos</option>
                    <option>Ventas</option><option>Marketing</option>
                    <option>Finanzas</option><option>Operaciones</option><option>Tecnología</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Rol de Sistema *</label>
                  <select name="rol" value={formData.rol} onChange={handleInputChange}>
                    <option value="director">Director</option>
                    <option value="lider">Lider</option>
                    <option value="empleado">Empleado</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Salario (COP)</label>
                  <input type="number" name="salario" value={formData.salario} onChange={handleInputChange} />
                </div>
              </div>

              <div className="form-actions">
                <button type="button" className="btn btn-primary" onClick={handleGuardar} disabled={registrando || !puedeAgregar || editingId !== null}>
                  {registrando ? '⏳ Registrando...' : '💾 Guardar'}
                </button>
                <button type="button" className="btn btn-warning" onClick={handleActualizar}>✏️ Actualizar</button>
                <button type="button" className="btn btn-danger" onClick={handleEliminar}>🗑️ Eliminar</button>
                <button type="button" className="btn btn-secondary" onClick={handleLimpiar}>🧹 Limpiar</button>
              </div>
            </form>
            
            {!editingId && (
              <div className="password-info">
                <br/>
                <p>🔑 <strong>Contraseña por defecto:</strong> {DEFAULT_PASSWORD}</p>
                <p className="info-text">El usuario recibirá un correo con sus credenciales (próximamente). Por ahora, comparte la contraseña de forma segura.</p>
              </div>
            )}
          </div>

          {/* Tabla de trabajadores */}
          <div className="panel-table-section">
            <div className="table-header">
              <h2>📋 Listado de Trabajadores</h2>
              <input type="text" placeholder="🔍 Buscar..." className="search-input" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
            <div className="table-wrapper">
              <table className="admin-table">
                <thead><tr><th>Nombre</th><th>Email</th><th>Cargo</th><th>Rol</th><th>Estado</th><th>Acciones</th></tr></thead>
                <tbody>
                  {filteredTrabajadores.length > 0 ? filteredTrabajadores.map(t => (
                    <tr key={t.id}>
                      <td><strong>{t.nombre}</strong></td><td>{t.email}</td><td>{t.cargo || '-'}</td>
                      <td><span className="role-badge">{t.rol}</span></td>
                      <td><span className={`status-badge ${t.estado === 'Activo' ? 'active' : 'inactive'}`}>{t.estado}</span></td>
                      <td><div className="action-buttons"><button className="btn-action btn-edit" onClick={() => handleEditar(t)}>✏️</button></div></td>
                    </tr>
                  )) : <tr><td colSpan="6" className="empty-message">No hay trabajadores registrados</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default PanelAdmin;