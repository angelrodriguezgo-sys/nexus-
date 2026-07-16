import { Outlet } from 'react-router-dom';
import Menu from '../components/Menu';
import Footer from '../components/Footer';

function LayoutPublico() {
  return (
    <div className="layout-publico">
      <Menu />
      <main className="main-content">
        <Outlet />  {/* Aquí se renderizan las páginas públicas */}
      </main>
      <Footer />
    </div>
  );
}

export default LayoutPublico;