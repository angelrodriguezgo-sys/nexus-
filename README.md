COWORKING VIRTUAL 

Frase / Eslogan: "NEXUS: Donde el caos empresarial se convierte en estructura, y las pequeñas ideas crecen con orden y claridad."


¿DE QUÉ TRATA EL PROYECTO?

NEXUS es una plataforma web de gestión organizacional diseñada específicamente para pequeñas y microempresas que necesitan organizar sus equipos de trabajo de manera eficiente y estructurada.

Características principales:
    Estructura piramidal: Jefe → Director → Líder → Empleado

    Espacios privados por equipo y nivel jerárquico

     Sistema de tareas con asignación, seguimiento y archivos adjuntos

     Comunicación interna similar a un correo electrónico pero organizada por equipos y proyectos

     Gestión de archivos por tarea y por equipo

     Planes escalables:
            Microempresa (5-10 usuarios)
            Pequeña Empresa (10-50 usuarios)
            Mediana Empresa (50-200 usuarios)


Tecnologías utilizadas:
* React (Frontend)

* Firebase (Backend y autenticación)

* Diseño responsive y moderno


-- PROBLEMAs QUE ABORDA

- Caos organizacional : Uso de WhatsApp, email personal o grupos desorganizados para coordinar tareas
- Falta de privacidad : Información sensible compartida en canales inseguros
- Desorden en tareas : No hay seguimiento claro de quién hace qué y cuándo
- Jerarquías difusas : No está claro quién reporta a quién ni los niveles de autoridad
- Pérdida de información : Archivos y documentos se pierden en conversaciones
- Costo de herramientas : Las soluciones existentes (Slack, Trello, Asana) pueden ser costosas o complejas para microempresas
- Falta de escalabilidad : Cuando la empresa crece, no tienen una herramienta que crezca con ellos


Contexto actual

Las micro y pequeñas empresas representan más del 90% del tejido empresarial en Latinoamérica, pero muchas carecen de acceso a herramientas de gestión asequibles y fáciles de usar. Terminan utilizando soluciones improvisadas que no cubren sus necesidades reales.


-- LA IDEA QUE ABORDO

Solución propuesta:
    NEXUS ofrece un entorno de trabajo virtual estructurado donde:

* Organización jerárquica clara:

    - El Jefe crea la empresa y define los roles

    - Los Directores gestionan áreas

    - Los Líderes coordinan equipos

    - Los Empleados reciben y ejecutan tareas

* Comunicación estructurada:

    - Cada tarea tiene su propio hilo de conversación

    - Los archivos se asocian directamente a las tareas

    - Visibilidad limitada según el rol (solo ven lo que les corresponde)

* Escalabilidad controlada:

    - Planes que crecen con la empresa

    - Límites de usuarios según el plan contratado

    - Posibilidad de agregar más roles y equipos

* Simplicidad:

    - Interfaz intuitiva similar al correo electrónico

    - Curva de aprendizaje mínima

    - Implementación rápida



-- IMPACTO DEL PROYECTO 

* Impacto cualitativo:
    - Cultura organizacional: Fomenta la responsabilidad y la transparencia

    Empoderamiento: Cada rol sabe exactamente sus funciones

    Colaboración: Espacios seguros para compartir y trabajar en equipo

    Profesionalización: Ayuda a microempresas a operar como grandes corporaciones

* Mercado objetivo:

    Microempresas (1-10 empleados) que están comenzando a organizarse

    Pequeñas empresas (10-50 empleados) que necesitan escalar ordenadamente

    Medianas empresas (50-200 empleados) que buscan optimizar su gestión

    Emprendedores que quieren profesionalizar su negocio


-- VISIÓN A FUTURO

* Corto plazo (6 meses):
    - MVP funcional con gestión básica de tareas y usuarios

    - Pilotos con 10 empresas para validación

    - Integración con autenticación de Firebase

* Mediano plazo (1 año):
    - App móvil complementaria

    - Reportes y analytics

    - Integración con Google Drive y Dropbox

    - Sistema de notificaciones en tiempo real

* Largo plazo (2-3 años):
    - IA para asignación inteligente de tareas

    - Marketplace de integraciones

    - Expansión a otros países de Latinoamérica

    - Versión en ingles y portuguéspara el publico extranjero 






CSS - APP


    
/* ===== VARIABLES DE COLORES ===== */

:root {
  --primary: #1A2B3C;
  --oil-blue: #36618d;
  --bright-blue: #4784ad;
  --gray-light: #ECF0F1;
  --gray-medium: #7F8C8D;
  --success: #27AE60;
  --warning: #F39C12;
  --error: #E74C3C;
  --white: #FFFFFF;
  --black: #000000;
}

/* ===== ESTILOS GENERALES ===== */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
  background-color: var( --bright-blue);
}

.app {
  min-height: 100vh;
}

/* ===== HEADER ===== */
.header {
  background-color: var(--gray-light);
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  position: sticky;
  top: 0;
  z-index: 50;
}

.header-container {
  max-width: 1300px;
  margin: 0 auto;
  padding: 15px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 15px;
}

/* Logo */
.logo-img{
  width: 250px;
  height: 65px;
}

.logo span {
  color: var(--gray-medium);
  font-size: 14px;
  direction: inherit;
}

/* Botones de navegación */
.nav-buttons {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: flex-end;
}

.nav-btn {
  background: transparent;
  border: none;
  padding: 10px 15px;
  border-radius: 50px;
  color: var(--oil-blue);
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s;
}

.nav-btn:hover {
  background-color: var(--white);
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.nav-btn svg {
  color: var(--bright-blue);
}

.login-btn {
  background-color: var(--bright-blue);
  color: var(--white);
  border: none;
  padding: 10px 20px;
  border-radius: 50px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: bold;
  box-shadow: 0 4px 6px rgba(52, 152, 219, 0.3);
  transition: all 0.3s;
}

.login-btn:hover {
  background-color: var(--primary);
}

/* ===== MODAL LOGIN ===== */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
  padding: 20px;
}

.modal {
  background-color: var(--white);
  border-radius: 16px;
  max-width: 400px;
  width: 100%;
  padding: 30px;
  position: relative;
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.close-btn {
  position: absolute;
  top: 15px;
  right: 15px;
  background: none;
  border: none;
  color: var(--gray-medium);
  cursor: pointer;
  font-size: 20px;
}

.close-btn:hover {
  color: var(--error);
}

.modal-title {
  color: var(--white);
  margin-top: 0;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.modal-title svg {
  color: var(--bright-blue);
}

/* Mensajes del formulario */
.message {
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.message.error {
  background-color: #FFEBEE;
  color: var(--error);
}

.message.warning {
  background-color: #FFF3E0;
  color: var(--warning);
}

.message.success {
  background-color: #E8F5E9;
  color: var(--success);
}

/* Formulario */
.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  color: var(--oil-blue);
  font-size: 14px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 5px;
}

.form-group label svg {
  color: var(--bright-blue);
}

.form-group input {
  width: 100%;
  padding: 12px;
  border: 1px solid var(--gray-light);
  border-radius: 8px;
  font-size: 16px;
  transition: all 0.3s;
}

.form-group input:focus {
  outline: none;
  border-color: var(--bright-blue);
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.2);
}

.submit-btn {
  width: 100%;
  background-color: var(--bright-blue);
  color: var(--white);
  border: none;
  padding: 12px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition: all 0.3s;
}

.submit-btn:hover {
  background-color: var(--primary);
}

.demo-info {
  text-align: center;
  font-size: 12px;
  color: var(--gray-medium);
  margin-top: 20px;
}

/* ===== CONTENIDO PRINCIPAL ===== */
.main-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 50px 20px;
}
.pasos-lista{
  text-align: left;
}
.section {
  margin-bottom: 80px;
  scroll-margin-top: 80px;
}

.section-title {
  color: var(--white);
  font-size: 36px;
  font-weight: 300;
  border-left: 8px solid var(--primary);
  padding-left: 20px;
  margin-bottom: 40px;
}

/* Tarjetas */
.cards-container {
  display: flex;
  gap: 20px;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 30px;
}

.card {
  background-color: var(--white);
  border: 2px solid var(--gray-light);
  transition: all 0.3s;
  flex: 1;
  min-width: 200px;
}

.card:hover {
  border-color: var(--bright-blue);
}

/* Tarjetas de servicio */
.service-card {
  padding: 45px;
  border-radius: 36px 14px 36px 14px;
  text-align: center;
  max-width: 900px;
}

.card-icon {
  font-size: 48px;
  color: var(--bright-blue);
  margin: 0 auto 15px;
  display: block;
}

.card-text {
  background-color: var(--gray-light);
  padding: 8px 16px;
  border-radius: 50px;
  font-weight: 500;
  color: var(--oil-blue);
  margin: 0;
}

/* Texto destacado */
.highlight-text {
  text-align: center;
  font-size: 20px;
  color: var(--white);
  max-width: 800px;
  margin: 0 auto;
}

.badge {
  background-color: var(--success);
  color: var(--white);
  padding: 5px 15px;
  border-radius: 50px;
  font-size: 14px;
  margin-left: 15px;
  display: inline-block;
}

/* Tarjetas de planes */
.plan-card {
  padding: 20px;
  border-radius: 24px;
  max-width: 300px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

.plan-title {
  color: var(--primary);
  font-size: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
}

.plan-title svg {
  color: var(--bright-blue);
}

.plan-description {
  color: var(--gray-medium);
  font-size: 14px;
  margin-bottom: 15px;
}

.plan-btn {
  border: 2px solid var(--bright-blue);
  background: transparent;
  color: var(--bright-blue);
  padding: 8px 16px;
  border-radius: 50px;
  width: 100%;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s;
}

.plan-btn:hover {
  background-color: var(--bright-blue);
  color: var(--white);
}

/* Banner de advertencia */
.warning-banner {
  background-color: var(--warning);
  color: var(--white);
  padding: 15px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  gap: 10px;
  max-width: 500px;
  margin: 0 auto;
  justify-content: center;
}

/* Tarjetas de contacto */
.contact-card {
  padding: 30px;
  border-radius: 32px 12px 32px 12px;
  text-align: center;
  max-width: 250px;
}

.card-info {
  color: var(--gray-medium);
  font-size: 14px;
  margin-top: 5px;
}

/* Caja de contacto */
.contact-box {
  background-color: var(--white);
  padding: 30px;
  border-radius: 60px 12px 60px 12px;
  border: 2px solid var(--gray-light);
  max-width: 600px;
  margin: 0 auto;
  box-shadow: 0 4px 6px rgba(0,0,0,0.05);
}

.contact-message {
  color: var(--oil-blue);
  display: flex;
  gap: 10px;
  align-items: flex-start;
}

.comment-icon {
  color: var(--bright-blue);
  font-size: 24px;
  flex-shrink: 0;
}

.contact-phone {
  margin-top: 20px;
  color: var(--gray-medium);
  display: flex;
  align-items: center;
  gap: 10px;
}

.phone-icon {
  color: var(--success);
}

/* ===== FOOTER ===== */
.footer {
  background-color: var(--primary);
  color: var(--white);
  padding: 30px;
  text-align: center;
}

.footer p {
  margin-bottom: 10px;
}

.footer-small {
  font-size: 14px;
  color: var(--gray-light);
  opacity: 0.8;
}

/* ===== RESPONSIVE ===== */
@media (max-width: 768px) {
  .header-container {
    flex-direction: column;
    text-align: center;
  }
  
  .nav-buttons {
    justify-content: center;
  }
  
  .section-title {
    font-size: 28px;
  }
  
  .card {
    min-width: 100%;
    max-width: 100%;
  }
  
  .highlight-text {
    font-size: 18px;
  }
  
  .badge {
    display: block;
    margin: 10px auto 0;
    width: fit-content;
  }
}



