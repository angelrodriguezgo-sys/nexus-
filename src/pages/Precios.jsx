import { Link} from "react-router-dom";
import "../Estilos/Precios.css";

function Precio(){

    
    return(
      <div className="precios-section">
        <section id="planes" >
          <h2 className="section-title">Paquetes de Planes</h2>

            <div className="cards-container">
                {/* Plan Microempresa */}
              <div className="card plan-card">
                <h3 className="plan-title"> Microempresa </h3>
                <p className="plan-description">
                    Capacidad de 5 a 10 Usuarios
                </p>
                  <button className="plan-btn">  
                      <Link to="/registro"  >$120.000 * Mes</Link> 
                  </button>
              </div>
            
            {/* Plan Pequeña Empresa */}
            <div className="card plan-card">
              <h3 className="plan-title">
                Pequeña Empresa
              </h3>
              <p className="plan-description">
                Capacidad de 10 a 50 Usuarios
              </p>
              <button className="plan-btn">   
               <Link to="/registro">$240.000 * Mes</Link> 
              </button>
            </div>
            
            {/* Plan Mediana Empresa */}
            <div className="card plan-card">
              <h3 className="plan-title">
                Mediana Empresa
              </h3>
              <p className="plan-description">
                Capacidad de 50 a 200 Usuarios
              </p>
              <button className="plan-btn"> 
                  <Link to="/CeoPage">Consultar</Link>
              </button>
            </div>
          </div>

          <div className="warning-banner">
          20% descuento en plan anual
          </div>
        </section>
      

      </div>
    );
}

export default Precio;