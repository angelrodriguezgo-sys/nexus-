import { Link } from "react-router-dom";
import { FaKey } from "react-icons/fa";
import "../Estilos/Menu.css";

function InicioSesion() {
  return (
    <div>
      <Link to="/login" className="login-btn">
        <FaKey /> Iniciar Sesión
      </Link>
    </div>
  );
}

export default InicioSesion;