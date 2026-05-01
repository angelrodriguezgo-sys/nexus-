import { useState } from "react";
import "/src/Estilos/Formulario.css";
import { Link, useNavigate } from "react-router-dom";

function Formulario() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    contraseña: "",
    telefono: "",
    terminos: false,
  });

  const [errores, setErrores] = useState({});

  // función de validación: no deja campos vacíos ni omite la
  // aceptación de términos; se puede ampliar para crear ruta
  const validarFormulario = () => {
    const nuevosErrores = {};

    if (!formData.nombre.trim()) {
      nuevosErrores.nombre = "El nombre es requerido";
    }
    if (!formData.apellido.trim()) {
      nuevosErrores.apellido = "El apellido es requerido";
    }
    if (!formData.email.trim()) {
      nuevosErrores.email = "El email es requerido";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      nuevosErrores.email = "Email inválido";
    }
    if (!formData.contraseña.trim()) {
      nuevosErrores.contraseña = "La contraseña es requerida";
    } else if (formData.contraseña.length < 8) {
      nuevosErrores.contraseña =
        "La contraseña debe tener mínimo 8 caracteres";
    }
    if (
      formData.telefono.trim() &&
      !/^\+?[\d\s]{7,}$/.test(formData.telefono)
    ) {
      nuevosErrores.telefono = "Teléfono inválido";
    }
    if (!formData.terminos) {
      nuevosErrores.terminos = "Debes aceptar los términos y condiciones";
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validarFormulario()) {
      console.log("Formulario válido, datos:", formData);
      // aquí puedes enviar los datos a tu API:
  
      alert("¡Registro exitoso! Bienvenido a NEXUS");
      setFormData({
        nombre: "",
        apellido: "",
        email: "",
        contraseña: "",
        telefono: "",
        terminos: false,
      });
      navigate("");

    }
  };

  return (
    <main className="registro-nexus">
      <div className="form-header">
        <h1>Crear Cuenta</h1>
        <p>Completa tus datos para registrarte en NEXUS</p>
      </div>

      <form className="form-container" onSubmit={handleSubmit}>
        <div className="grupo">
          <label>
            <span className="label-text">Nombre</span>
            <span className="required">*</span>
          </label>
          <div className="input-wrapper">
            <input
              type="text"
              name="nombre"
              placeholder="Tu nombre"
              className="form-input"
              value={formData.nombre}
              onChange={handleChange}
            />
          </div>
          {errores.nombre && (
            <span className="error-message">{errores.nombre}</span>
          )}
        </div>

        <div className="grupo">
          <label>
            <span className="label-text">Apellido</span>
            <span className="required">*</span>
          </label>
          <div className="input-wrapper">
            <input
              type="text"
              name="apellido"
              placeholder="Tu apellido"
              className="form-input"
              value={formData.apellido}
              onChange={handleChange}
            />
          </div>
          {errores.apellido && (
            <span className="error-message">{errores.apellido}</span>
          )}
        </div>

        <div className="grupo">
          <label>
            <span className="label-text">Correo electrónico</span>
            <span className="required">*</span>
          </label>
          <div className="input-wrapper">
            <input
              type="email"
              name="email"
              placeholder="ejemplo@correo.com"
              className="form-input"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          {errores.email && (
            <span className="error-message">{errores.email}</span>
          )}
        </div>

        <div className="grupo">
          <label>
            <span className="label-text">Contraseña</span>
            <span className="required">*</span>
          </label>
          <div className="input-wrapper">
            <input
              type="password"
              name="contraseña"
              placeholder="••••••••"
              className="form-input"
              value={formData.contraseña}
              onChange={handleChange}
            />
          </div>
          <small className="input-helper">Mínimo 8 caracteres</small>
          {errores.contraseña && (
            <span className="error-message">{errores.contraseña}</span>
          )}
        </div>

        <div className="grupo">
          <label>
            <span className="label-text">Teléfono</span>
          </label>
          <div className="input-wrapper">
            <input
              type="tel"
              name="telefono"
              placeholder="+57 300 123 4567"
              className="form-input"
              value={formData.telefono}
              onChange={handleChange}
            />
          </div>
          {errores.telefono && (
            <span className="error-message">{errores.telefono}</span>
          )}
        </div>

        <div className="terminos">
          <input
            type="checkbox"
            id="terminos"
            name="terminos"
            checked={formData.terminos}
            onChange={handleChange}
          />
          <label htmlFor="terminos">
            Acepto los <a href="#">términos y condiciones</a> y la{" "}
            <a href="#">política de privacidad</a>
          </label>
        </div>
        {errores.terminos && (
          <span className="error-message">{errores.terminos}</span>
        )}

        <div className="acciones">
          <button type="submit" className="btn-primario">
            <span>Registrarse</span>
            <svg
              className="btn-icon"
              viewBox="0 0 24 24"
              width="20"
              height="20"
            >
              <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z" />
            </svg>
          </button>

          <button type="button" className="btn-secundario">
            <Link to="/">Cancelar</Link>
          </button>
        </div>
      </form>

      <div className="form-footer">
        <p>
          ¿Ya tienes una cuenta? <a href="#">Inicia sesión</a>
        </p>
      </div>
    </main>
  );
}

export default Formulario;