// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  auth, 
  db,
  collection,
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  increment,
  query,
  where,
  getDocs
} from '../services/firebase/Firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  onAuthStateChanged
} from 'firebase/auth';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [empresa, setEmpresa] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ============================================================
  // 1. ESCUCHAR CAMBIOS EN AUTENTICACIÓN
  // ============================================================
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Obtener datos del usuario desde Firestore
          const userDoc = await getDoc(doc(db, 'usuarios', firebaseUser.uid));
          const userData = userDoc.exists() ? userDoc.data() : {};
          
          // ✅ Usuario con todos sus datos (incluyendo rol y empresa_id)
          const userInfo = {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            nombre: userData.nombre || '',
            apellido: userData.apellido || '',
            rol: userData.rol || 'empleado',        // ✅ ROL: ceo, director, lider, empleado
            empresa_id: userData.empresa_id || null,
            area: userData.area || '',
            equipo: userData.equipo || '',
            telefono: userData.telefono || '',
            cargo: userData.cargo || '',
            activo: userData.activo !== false,
            fecha_ingreso: userData.fecha_ingreso || new Date(),
            created_at: userData.created_at || new Date()
          };
          setUser(userInfo);

          // ✅ Obtener datos de la empresa si existe
          if (userInfo.empresa_id) {
            const empresaDoc = await getDoc(doc(db, 'empresas', userInfo.empresa_id));
            if (empresaDoc.exists()) {
              const empresaData = empresaDoc.data();
              setEmpresa({
                id: empresaDoc.id,
                nombre: empresaData.nombre || '',
                nit: empresaData.nit || '',
                plan_id: empresaData.plan_id || 'plan_basico',
                plan_nombre: empresaData.plan_nombre || 'Básico',
                max_usuarios: empresaData.max_usuarios || 10,
                usuarios_actuales: empresaData.usuarios_actuales || 0,
                estructura: empresaData.estructura || {},
                estado: empresaData.estado || 'activa',
                fecha_creacion: empresaData.fecha_creacion || new Date(),
                created_at: empresaData.created_at || new Date()
              });
            }
          }
        } catch (err) {
          console.error('Error al obtener datos del usuario:', err);
          // Si hay error, al menos tenemos el usuario básico
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            rol: 'empleado'
          });
        }
      } else {
        setUser(null);
        setEmpresa(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // ============================================================
  // 2. REGISTRO DE USUARIO (CEO, DIRECTOR, LÍDER, EMPLEADO)
  // ============================================================
  const register = async (email, password, userData = {}) => {
    setError(null);
    try {
      // 1. Crear usuario en Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      // 2. Preparar datos del usuario
      const nuevoUsuario = {
        uid: firebaseUser.uid,
        email: email,
        nombre: userData.nombre || '',
        apellido: userData.apellido || '',
        telefono: userData.telefono || '',
        rol: userData.rol || 'empleado',        // ✅ 'ceo', 'director', 'lider', 'empleado'
        empresa_id: userData.empresaId || null,
        area: userData.area || '',
        equipo: userData.equipo || '',
        cargo: userData.cargo || '',
        superior_id: userData.superiorId || null,
        activo: true,
        fecha_ingreso: new Date(),
        ultimo_acceso: new Date(),
        created_at: new Date()
      };

      // 3. Guardar en Firestore
      await setDoc(doc(db, 'usuarios', firebaseUser.uid), nuevoUsuario);

      // 4. Si tiene empresa_id, incrementar contador de usuarios
      if (userData.empresaId && userData.rol !== 'ceo') {
        const empresaRef = doc(db, 'empresas', userData.empresaId);
        await updateDoc(empresaRef, {
          usuarios_actuales: increment(1)
        });
      }

      // 5. Actualizar estado local
      setUser({
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        ...nuevoUsuario
      });

      return { success: true, user: firebaseUser };

    } catch (err) {
      console.error('Error en registro:', err);
      setError(err);
      throw err;
    }
  };

  // ============================================================
  // 3. REGISTRO COMPLETO DE EMPRESA + CEO
  // ============================================================
  const registrarEmpresaCompleta = async (empresaData, planSeleccionado, ceoData) => {
    setError(null);
    try {
      // 1. Crear empresa en Firestore
      const empresaId = `emp_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
      
      const nuevaEmpresa = {
        id: empresaId,
        nombre: empresaData.nombre,
        nit: empresaData.nit,
        plan_id: planSeleccionado.id,
        plan_nombre: planSeleccionado.nombre,
        max_usuarios: planSeleccionado.max_usuarios,
        usuarios_actuales: 1,  // El CEO será el primero
        estructura: {
          ceo: empresaData.cantidades?.ceo || 1,
          directores: empresaData.cantidades?.directores || 0,
          lideres: empresaData.cantidades?.lideres || 0,
          empleados: empresaData.cantidades?.empleados || 0
        },
        estado: 'activa',
        fecha_creacion: new Date(),
        created_at: new Date()
      };

      await setDoc(doc(db, 'empresas', empresaId), nuevaEmpresa);

      // 2. Registrar CEO
      const userCredential = await createUserWithEmailAndPassword(auth, ceoData.email, ceoData.password);
      const firebaseUser = userCredential.user;

      const nuevoCeo = {
        uid: firebaseUser.uid,
        email: ceoData.email,
        nombre: ceoData.nombre,
        apellido: ceoData.apellido,
        telefono: ceoData.telefono || '',
        rol: 'ceo',                    // ✅ CEO
        empresa_id: empresaId,
        area: 'Dirección General',
        cargo: 'CEO',
        activo: true,
        fecha_ingreso: new Date(),
        ultimo_acceso: new Date(),
        created_at: new Date()
      };

      await setDoc(doc(db, 'usuarios', firebaseUser.uid), nuevoCeo);

      // 3. Actualizar estado local
      setUser({
        uid: firebaseUser.uid,
        email: ceoData.email,
        ...nuevoCeo
      });
      setEmpresa(nuevaEmpresa);

      return { success: true, empresaId, user: firebaseUser };

    } catch (err) {
      console.error('Error en registro completo:', err);
      setError(err);
      throw err;
    }
  };

  // ============================================================
  // 4. LOGIN
  // ============================================================
  const login = async (email, password) => {
    setError(null);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (err) {
      let mensajeError = 'Error al iniciar sesión';
      if (err.code === 'auth/user-not-found') {
        mensajeError = '❌ No existe una cuenta con este correo';
      } else if (err.code === 'auth/wrong-password') {
        mensajeError = '❌ Contraseña incorrecta';
      } else if (err.code === 'auth/invalid-email') {
        mensajeError = '❌ Correo electrónico inválido';
      } else if (err.code === 'auth/too-many-requests') {
        mensajeError = '❌ Demasiados intentos. Intenta más tarde';
      }
      setError(mensajeError);
      throw err;
    }
  };

  // ============================================================
  // 5. LOGOUT
  // ============================================================
  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setEmpresa(null);
    } catch (err) {
      console.error('Error al cerrar sesión:', err);
      setError('Error al cerrar sesión');
    }
  };

  // ============================================================
  // 6. OBTENER EMPLEADOS POR EMPRESA Y ROL
  // ============================================================
  const getEmpleadosByEmpresa = async (empresaId) => {
    try {
      const q = query(collection(db, 'usuarios'), where('empresa_id', '==', empresaId));
      const querySnapshot = await getDocs(q);
      const empleados = [];
      querySnapshot.forEach(doc => {
        empleados.push({ id: doc.id, ...doc.data() });
      });
      return empleados;
    } catch (err) {
      console.error('Error al obtener empleados:', err);
      return [];
    }
  };

  // ============================================================
  // 7. OBTENER EMPLEADOS POR ÁREA (para Director)
  // ============================================================
  const getEmpleadosByArea = async (empresaId, area) => {
    try {
      const q = query(
        collection(db, 'usuarios'), 
        where('empresa_id', '==', empresaId),
        where('area', '==', area)
      );
      const querySnapshot = await getDocs(q);
      const empleados = [];
      querySnapshot.forEach(doc => {
        empleados.push({ id: doc.id, ...doc.data() });
      });
      return empleados;
    } catch (err) {
      console.error('Error al obtener empleados por área:', err);
      return [];
    }
  };

  // ============================================================
  // 8. VERIFICAR LÍMITE DE USUARIOS
  // ============================================================
  const verificarLimiteUsuarios = async (empresaId) => {
    try {
      const empresaDoc = await getDoc(doc(db, 'empresas', empresaId));
      if (!empresaDoc.exists()) return { puedeAgregar: false, disponibles: 0 };
      
      const empresaData = empresaDoc.data();
      const actuales = empresaData.usuarios_actuales || 0;
      const maximo = empresaData.max_usuarios || 10;
      
      return {
        puedeAgregar: actuales < maximo,
        actuales,
        maximo,
        disponibles: maximo - actuales
      };
    } catch (err) {
      console.error('Error al verificar límite:', err);
      return { puedeAgregar: false, disponibles: 0 };
    }
  };

  // ============================================================
  // 9. VALOR EXPORTADO
  // ============================================================
  return (
    <AuthContext.Provider value={{
      user,           // ✅ Datos del usuario logueado (incluye rol)
      empresa,        // ✅ Datos de la empresa
      loading,        // ✅ Estado de carga
      error,          // ✅ Errores
      register,       // ✅ Registrar usuario (CEO, Director, Líder, Empleado)
      registrarEmpresaCompleta, // ✅ Registrar empresa + CEO
      login,          // ✅ Iniciar sesión
      logout,         // ✅ Cerrar sesión
      getEmpleadosByEmpresa,  // ✅ Obtener todos los empleados
      getEmpleadosByArea,      // ✅ Obtener empleados por área
      verificarLimiteUsuarios  // ✅ Verificar límite del plan
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);