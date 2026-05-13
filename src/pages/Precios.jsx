import { Link, useNavigate } from "react-router-dom";
import "../Estilos/Precios.css";

function Precio() {
  const navigate = useNavigate();

  // ✅ Definición de planes con sus límites
  const planes = [
    {
      id: "plan_basico",
      nombre: "Plan Básico",
      precio: 120000,
      precioTexto: "$120.000 * Mes",
      max_usuarios: 10,
      min_usuarios: 5,
      descripcion: "Ideal para Micro-empresas en etapas de desarrollo que buscan volver su empresa más competitiva en el mercado.",
      color: "#3498DB",
      ruta: "/registro"
    },
    {
      id: "plan_profesional",
      nombre: "Plan Profesional",
      precio: 320000,
      precioTexto: "$320.000 * Mes",
      max_usuarios: 50,
      min_usuarios: 10,
      descripcion: "Para Pequeñas Empresas en crecimiento y expansión, con deseo de optimizar sus procesos.",
      color: "#E67E22",
      ruta: "/registro"
    },
    {
      id: "plan_premium",
      nombre: "Plan Premium",
      precio: 0,
      precioTexto: "Consultar",
      max_usuarios: 200,
      min_usuarios: 50,
      descripcion: "Dirigido a Medianas Empresas que buscan una solución a medida para sus necesidades específicas.",
      color: "#F1C40F",
      ruta: "/contacto"
    }
  ];

  const handleSeleccionarPlan = (plan) => {
    // ✅ Guardar el plan seleccionado en localStorage o pasarlo por estado
    navigate('/registro', { 
      state: { 
        planSeleccionado: {
          id: plan.id,
          nombre: plan.nombre,
          max_usuarios: plan.max_usuarios,
          precio: plan.precio
        }
      } 
    });
  };

  return (
    <div className="precios-section">
      <section id="planes">
        <h2 className="section-title">Paquetes de Planes</h2>

        <div className="cards-container">
          {planes.map((plan) => (
            <div key={plan.id} className="card plan-card" style={{ borderTop: `4px solid ${plan.color}` }}>
              <h3 className="plan-title">{plan.nombre}</h3>
              <p className="plan-description">{plan.descripcion}</p>
              <div className="plan-limite">
                <span className="limite-label">👥 Capacidad:</span>
                <span className="limite-valor">{plan.min_usuarios} - {plan.max_usuarios} usuarios</span>
              </div>
              <div className="plan-precio">
                <span className="precio-valor">{plan.precioTexto}</span>
              </div>
              <button 
                className="plan-btn" 
                onClick={() => handleSeleccionarPlan(plan)}
                style={{ backgroundColor: plan.color }}
              >
                Seleccionar Plan
              </button>
            </div>
          ))}
        </div>

        <div className="warning-banner">
          20% descuento en plan anual
        </div>
      </section>
    </div>
  );
}

export default Precio;