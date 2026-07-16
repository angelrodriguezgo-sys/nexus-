import { Route, Routes, Navigate } from 'react-router-dom';  
import './App.css';

// ===== COMPONENTES PÚBLICOS =====
import Menu from './components/Menu';
import Home from './pages/Home';
import Precio from './pages/Precios';
import Contacto from './pages/Contacto';
import Login from './components/Login';
import Registro from './components/Registro';
import UserRegister from './components/UserRegister';
import Footer from './components/Footer';

// ===== COMPONENTES PRIVADOS =====
import CeoPage from './users/ceo/CeoPage';
import Director from './users/director/Director';
import Lider from './users/lider/Lider';
import Empleado from './users/empleado/Empleado';
import PanelAdmin from './pages/PanelAdmin';
import ChatEmpresarial from './pages/ChatEmpresarial';
import Logout from './components/Logout';

// ===== LAYOUTS =====
import LayoutPublico from './components/LayoutPublico';
import LayoutPrivado from './components/LayoutPrivado';

// ===== CONTEXTO =====
import { AuthProvider, useAuth } from './context/AuthContext';


// ============================================================
// COMPONENTE DE PROTECCIÓN DE RUTAS
// ============================================================
function ProtectedRoute({ children, allowedRoles = [] }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="loading-screen">Cargando...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.rol)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

// ============================================================
// COMPONENTE PRINCIPAL DE RUTAS
// ============================================================
function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="loading-screen">Cargando...</div>;
  }

  return (
    <Routes>
      {/* ============================================
          RUTAS PÚBLICAS (LayoutPublico)
          ============================================ */}
      <Route element={<LayoutPublico />}>
        <Route path="/" element={<Home />} />
        <Route path="/precios" element={<Precio />} />
        <Route path="/contacto" element={<Contacto />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/UserRegister" element={<UserRegister />} />
      </Route>

      {/* ============================================
          RUTAS PRIVADAS (LayoutPrivado)
          ============================================ */}
      <Route element={<LayoutPrivado />}></Route>
        <Route 
          path="/CeoPage" 
          element={
            <ProtectedRoute allowedRoles={['ceo']}>
              <CeoPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/DirectorPage" 
          element={
            <ProtectedRoute allowedRoles={['director']}>
              <Director />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/LiderPage" 
          element={
            <ProtectedRoute allowedRoles={['lider']}>
              <Lider />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/EmpleadoPage" 
          element={
            <ProtectedRoute allowedRoles={['empleado']}>
              <Empleado />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/PanelAdmin" 
          element={
            <ProtectedRoute allowedRoles={['ceo', 'director']}>
              <PanelAdmin />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/chat-empresarial" 
          element={
            <ProtectedRoute>
              <ChatEmpresarial />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/logout" 
          element={
            <ProtectedRoute>
              <Logout />
            </ProtectedRoute>
          } 
        />
      


    </Routes>
  );
}

// ============================================================
// APP PRINCIPAL
// ============================================================
function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;