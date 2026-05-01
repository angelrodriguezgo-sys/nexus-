import { Route, Routes } from 'react-router-dom';
import './App.css'; 
import Menu from './components/Menu';
import Home from './pages/Home';
import Precio from './pages/Precios';
import Contacto from './pages/Contacto';
import Formulario from './pages/Formulario';
import Registro from './components/Registro';
import CeoPage from './users/ceo/CeoPage';
import Footer from './components/Footer';
import PanelAdmin  from './pages/PanelAdmin';
import Login from './components/Login';
import Register from './components/Register';
import ChatEmpresarial from './pages/ChatEmpresarial';

function App() {

  return (
    <>  
       <Menu/>
        <Routes>
            <Route path='/' element={<Home/>}/>
            <Route path='/precios' element={<Precio/> }/>
            <Route path='/contacto' element={<Contacto/>}/>
            <Route path='/formulario' element={<Formulario/>}/>
            <Route path="/registro" element={<Registro/>} /> {/* Registrar empresa */}
            <Route path='/CeoPage' element={  <CeoPage/> } />
            <Route path='/PanelAdmin' element={<PanelAdmin/>} /> 
            <Route path='/login' element={<Login/>} />
            <Route path='/register' element={<Register/>} />
            <Route path='/chat-empresarial' element={<ChatEmpresarial />} /> {/* Nueva ruta para el chat empresarial */}
        </Routes>
        <Footer/>
    </> 
  ); 
}

export default App;