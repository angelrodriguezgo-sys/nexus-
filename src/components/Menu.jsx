import { Link } from "react-router-dom";
import Logo from "../assets/Logo";
import '../Estilos/Menu.css';
import InicioSesion from "./InicioSesion";
import { FaCalendar, FaHome, FaPhone } from "react-icons/fa";

function  Menu(){
   
    return(
        <nav className="header" >
            <Logo/>
            <Link to="/"> <FaHome/>Nosotros</Link>
            <Link to="/precios"> <FaCalendar/>Precios</Link>
            <Link to="/contacto"> <FaPhone/> Contacto</Link>
            <InicioSesion/>
        </nav>
    );
}

export default Menu;