import React, { useState } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import '../Estilos/Calendario.css';  // 

function Calendario({ onSelectDate }) {
  const [fechaActual, setFechaActual] = useState(new Date());
  const [diaSeleccionado, setDiaSeleccionado] = useState(null);

  const cambiarMes = (incremento) => {
    setFechaActual(new Date(fechaActual.getFullYear(), fechaActual.getMonth() + incremento, 1));
    setDiaSeleccionado(null); // Resetear selección al cambiar mes
  };

  const diasSemana = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
  
  const getDiasDelMes = () => {
    const año = fechaActual.getFullYear();
    const mes = fechaActual.getMonth();
    const primerDia = new Date(año, mes, 1).getDay();
    const ultimoDia = new Date(año, mes + 1, 0).getDate();
    
    const dias = [];
    const primerDiaAjustado = primerDia === 0 ? 6 : primerDia - 1;
    
    for (let i = 0; i < primerDiaAjustado; i++) dias.push(null);
    for (let i = 1; i <= ultimoDia; i++) dias.push(i);
    
    return dias;
  };

  const diasDelMes = getDiasDelMes();

  const handleDiaClick = (dia) => {
    if (dia) {
      setDiaSeleccionado(dia);
      if (onSelectDate) {
        onSelectDate(dia);
      }
    }
  };

  return (
    <div className="calendario-container">
      <div className="calendario-header">
        <button onClick={() => cambiarMes(-1)} className="mes-nav">
          <FaChevronLeft />
        </button>
        <h3>{fechaActual.toLocaleString('default', { month: 'long' })} {fechaActual.getFullYear()}</h3>
        <button onClick={() => cambiarMes(1)} className="mes-nav">
          <FaChevronRight />
        </button>
      </div>

      <div className="calendario-semana">
        {diasSemana.map(dia => <div key={dia} className="dia-semana">{dia}</div>)}
      </div>

      <div className="calendario-dias">
        {diasDelMes.map((dia, idx) => (
          <div 
            key={idx} 
            className={`dia-mes ${dia ? '' : 'vacio'} ${dia === diaSeleccionado ? 'seleccionado' : ''}`}
            onClick={() => handleDiaClick(dia)}
          >
            {dia && (
              <>
                <span className="dia-numero">{dia}</span>
                {dia === 15 && <span className="evento-indicador"></span>}
              </>
            )}
          </div>
        ))}
      </div>

      <div className="calendario-eventos">
        <h4>Eventos del día</h4>
        <div className="evento-item">
          <span className="evento-hora">10:00</span>
          <span className="evento-titulo">Reunión directores</span>
        </div>
        <div className="evento-item">
          <span className="evento-hora">14:30</span>
          <span className="evento-titulo">Evaluación líderes</span>
        </div>
        <div className="evento-item">
          <span className="evento-hora">16:00</span>
          <span className="evento-titulo">Entrega reportes</span>
        </div>
      </div>
    </div>
  );
}

export default Calendario;