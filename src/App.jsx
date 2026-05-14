import { Route, Routes } from 'react-router-dom';
import './App.css'; 
import Menu from './components/Menu';
import Home from './pages/Home';
import Precio from './pages/Precios';
import Contacto from './pages/Contacto';

import Registro from './components/Registro';
import CeoPage from './users/ceo/CeoPage';
import Footer from './components/Footer';
import PanelAdmin  from './pages/PanelAdmin';
import Login from './components/Login';

import UserRegister from './components/UserRegister';   

import ChatEmpresarial from './pages/ChatEmpresarial';
import Director from './users/director/Director';
import Lider from './users/lider/Lider';
import Empleado from './users/empleado/Empleado'; 
import { RiOilFill } from 'react-icons/ri';
import Logout from './components/Logout';

import TestFirebase from './TestFirebase';
import { AuthProvider } from './context/AuthContext'

function App() {

  return (
    <>  
   

       <Menu/>
        <Routes>
            <Route path='/' element={<Home/>}/>
            <Route path='/precios' element={<Precio/> }/>
            <Route path='/contacto' element={<Contacto/>}/>
            <Route path="/registro" element={<Registro/>} /> {/* Registrar empresa */}
            <Route path='/UserRegister' element={<UserRegister/>} /> {/*  registro de usuarios */}
            <Route path='/login' element={<Login/>} />

            <Route path='/logout' element={<Logout />} /> 
            <Route path='/CeoPage' element={  <CeoPage/> } />
            <Route path='/DirectorPage' element={<Director/>} />
            <Route path='/LiderPage' element={<Lider/>} />
            <Route path='/EmpleadoPage' element={<Empleado/>} />
            <Route path='/PanelAdmin' element={<PanelAdmin/>} /> 
            <Route path='/chat-empresarial' element={<ChatEmpresarial />} /> {/* Nueva ruta para el chat empresarial */}
           
        </Routes>
        <Footer/>
    </> 
  ); 
}

export default App;