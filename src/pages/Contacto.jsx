import "../Estilos/Contacto.css";

function Contacto(){

    return(
    <div className="contacto-section">
    <section id="contacto" >
      <h2 className="section-title">Contáctenos</h2>
      
    <div className="cards-container">
    
      <div className="card contact-card">
        <div className="card-icon">📍</div>
        <p className="card-text">Av. Central 123</p>
        <p className="card-info">Medellín, Colombia</p>
        <p className="card-subinfo">Oficina 502, Torre Empresarial</p>
      </div>
     
      <div className="card contact-card">
        <div className="card-icon">💬</div>
        <p className="card-text">WhatsApp 24/7</p>
        <p className="card-info">+57 601 234 5678</p>
        <p className="card-subinfo">Respuesta inmediata</p>
      </div>
      
      <div className="card contact-card">
        <div className="card-icon">✉️</div>
        <p className="card-text">Email</p>
        <p className="card-info">hola@cowork.space</p>
        <p className="card-subinfo">soporte@cowork.space</p>
      </div>

      <div className="card contact-card">
        <div className="card-icon">🕒</div>
        <p className="card-text">Horario de atención</p>
        <p className="card-info">Lun - Vie: 8am a 8pm</p>
        <p className="card-subinfo">Sábados: 9am a 2pm</p>
      </div>
    </div>

    
    <div className="social-section">
      <h3 className="social-title">Síguenos en redes</h3>
      <div className="social-icons">
        <a href="#" className="social-link">📘 Facebook</a>
        <a href="#" className="social-link">📸 Instagram</a>
        <a href="#" className="social-link">💼 LinkedIn</a>
        <a href="#" className="social-link">🐦 Twitter</a>
      </div>
    </div>

    <div className="form-container">
      <h3 className="form-title">Escríbenos directamente</h3>
      <form className="contact-form">
        <div className="form-row">
          <input type="text" placeholder="Nombre completo" className="form-input" />
          <input type="email" placeholder="Correo electrónico" className="form-input" />
        </div>
        <div className="form-row">
          <input type="tel" placeholder="Teléfono" className="form-input" />
          <select className="form-input">
            <option>¿Cómo nos conociste?</option>
            <option>Google</option>
            <option>Redes sociales</option>
            <option>Recomendación</option>
            <option>Otro</option>
          </select>
        </div>
        <textarea 
          placeholder="Cuéntanos tu consulta..." 
          className="form-textarea"
          rows="4"
        ></textarea>
        <button type="submit" className="submit-btn">Enviar mensaje ✨</button>
      </form>
    </div>
      
    <div className="contact-box">
      <p className="contact-message">
        💎 ¿Dudas? Te respondemos en menos de 30 minutos
      </p>
      <p className="contact-phone">
        📞 +57 601 234 5678
      </p>
      <p className="contact-note">
        * Llamadas nacionales sin costo adicional
      </p>
    </div>
  </section>
</div>
  );
}

export default Contacto;