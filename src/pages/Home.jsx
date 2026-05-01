import { FaBullseye, FaChartLine, FaEye, FaHandshake, FaRocket, FaUsers } from 'react-icons/fa';
import'../Estilos/Home.css';


function Home(){
  return(
    <div className="home-section">
        <section id="nosotros">
            <h2 className="section-title"> Nosotros </h2>
            <div className="cards-container">
                <div className="card service-card">
                <div className="quienes-somos-content">
                    <FaUsers className="section-icon" /> 
                    <p className="quienes-somos-texto">
                        Somos una plataforma web innovadora diseñada especialmente para pequeñas y microempresas 
                        que buscan organizar sus equipos de trabajo de manera eficiente. Nuestra solución permite 
                        una supervisión detallada en el desarrollo de tareas y un análisis preciso del desempeño laboral.
                    </p>
                    <p className="quienes-somos-texto">
                        Facilitamos la comunicación y privacidad entre los miembros del equipo al momento de compartir 
                        información sensible y documentos importantes. Nos especializamos en crear espacios cowork virtuales 
                        donde puedes realizar seguimiento en tiempo real de tus proyectos y colaborar con tu equipo 
                        maximizando el potencial de cada miembro.
                    </p>
                </div>
                </div>
            </div>

            {/* Tarjetas de servicios */}
                <div className="servicios-grid">
                    <div className="servicio-item">
                        <FaRocket className="servicio-icon" />
                        <h3>Organización Eficiente</h3>
                        <p>Gestiona equipos y tareas de forma intuitiva</p>
                    </div>
                    <div className="servicio-item">
                        <FaHandshake className="servicio-icon" />
                        <h3>Comunicación Segura</h3>
                        <p>Comparte información con total privacidad</p>
                    </div>
                    <div className="servicio-item">
                        <FaChartLine className="servicio-icon" />
                        <h3>Análisis de Desempeño</h3>
                        <p>Monitorea el progreso de tus proyectos</p>
                    </div>
                </div>
        </section>

            {/* SECCIÓN VISIÓN */}
            <section id="vision" className="section vision-section">
                <h2 className="section-title vision-title">Nuestra Visión</h2>
                
                <div className="vision-container">
                    <div className="vision-content">
                   
                        <FaEye className="vision-icon" />
                        <div className="vision-texto">
                            <p>
                                Ser la plataforma líder en gestión de equipos para pequeñas y microempresas en Latinoamérica, 
                                reconocida por transformar la manera en que los emprendedores organizan sus proyectos y 
                                potencian el talento humano. Aspiramos a crear un ecosistema digital donde la colaboración 
                                fluya sin barreras y el éxito empresarial sea accesible para todos.
                            </p>
                            <div className="vision-destacado" >
                                Para el 2028, esperamos impactar a más de 10,000 empresas y facilitar la creación de 
                                espacios de trabajo colaborativo que impulsen la productividad y el crecimiento sostenible.
                            </div>
                        </div>
                    </div>
                    
                    <div className="vision-stats">
                        <div className="stat-item">
                            <span className="stat-numero">10K+</span>
                            <span className="stat-label">Empresas impactadas</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-numero">50K+</span>
                            <span className="stat-label">Usuarios activos</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-numero">5</span>
                            <span className="stat-label">Países</span>
                        </div>
                    </div>
                </div>

            </section>

            {/* SECCIÓN MISIÓN */}
            <section id="mision" className="section mision-section">
                <h2 className="section-title mision-title">Nuestra Misión</h2>
                
                <div className="mision-container">
                    <div className="mision-content">
                     
                        <FaBullseye className="mision-icon" />
                        <div className="mision-texto">
                            <p>
                                Proveer a las pequeñas y microempresas las herramientas tecnológicas necesarias para 
                                optimizar su gestión organizacional, permitiéndoles:
                            </p>
                            <ul className="mision-lista">
                                <li> Organizar equipos de trabajo de manera jerárquica y eficiente</li>
                                <li> Facilitar la comunicación interna y el intercambio seguro de información</li>
                                <li> Simplificar el seguimiento de tareas y evaluación de desempeño</li>
                                <li> Democratizar el acceso a tecnología de gestión empresarial</li>
                                <li> Crear espacios virtuales de colaboración que maximicen la productividad</li>
                            </ul>
                            <p className="mision-compromiso">
                                Nos comprometemos a mantener una mejora continua de nuestra plataforma, 
                                escuchando las necesidades de nuestros usuarios y adaptándonos a los cambios 
                                del entorno empresarial.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Final */}
            <div className="cta-container">
                <p className="highlight-text">
                    Espacios colaborativos para maximizar TU emprendimiento.
                    <span className="badge">+500 miembros activos</span>
                </p>
            </div>
    </div>
); 
}


export default Home;