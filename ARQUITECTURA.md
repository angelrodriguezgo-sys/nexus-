Versión 1.0 
Fecha : 17/03/2026
Autor : ANGEL DAVID RODRIGUEZ GONZALEZ 
Descripcion : Documento inicial de arquitectura
Proyecto : NEXUS (Proyecto integrador)

* Concepto; CAJA : Se utiliza la palabra caja como ejemplo de la conceptualizacion del proyecto, su sinonimo en este caso seria el COWORKING virtual, pero la CAJA contiene a lso empleados de la empresa y sus datos, y se identifica con el NIT de la empresa


1. INTRODUCCIÓN
1.1 Propósito del Documento
Este documento tiene como objetivo describir la arquitectura técnica, el modelado de datos, los diagramas de flujo y la lógica de negocio de la plataforma NEXUS, una aplicación web diseñada para la gestión jerárquica de pequeñas y microempresas.

1.2 Alcance
El documento abarca la arquitectura completa del sistema, incluyendo frontend, backend, base de datos, flujos de usuario, estructura de navegación y lógica de negocio.


2. VISIÓN GENERAL DEL PROYECTO
2.1 Descripción del Proyecto
NEXUS es una plataforma web de gestión organizacional diseñada específicamente para pequeñas y microempresas que necesitan organizar sus equipos de trabajo de manera eficiente y estructurada.

2.2 Objetivos Principales
Proveer una estructura jerárquica clara (Jefe → Director → Líder → Empleado)

Facilitar la asignación y seguimiento de tareas

Garantizar la privacidad y seguridad de la información

Ofrecer una solución escalable y asequible

2.3 Usuarios del Sistema
Rol	              Descripción	                   Permisos Principales
Jefe	     Administrador general	           Gestión completa de la empresa
Director	 Gerente de área	               Gestión de líderes y reportes de área
Líder	     Coordinador de equipo	           Asignación de tareas y gestión de empleados
Empleado	 Personal operativo	               Visualización y respuesta de tareas






ESTRUCTURA DE LA "CAJA" 

Empresa (Nit empresa - Se usa el nit de la empresa como ID unico para crear la caja ) 
    Nombre Empresa
    Ceo  : Email - datos personales basicos 
    Lider : Email - datos personales basicos 
    Director  : Email - datos personales basicos 
    Empleado : Email - datos personales basicos 
    * Tendra una catidad determinada de usuarios en base al plan seleccionado 

Cuando inicien sesion en la pagina principal, si estan registrados en la Empresa, este buscara su correo en la base de datos de usuario, Entrando primero en la lista de usuarios y ver que exista y luego ver a que empresa pertenece e ingresarlo a la CAJA 



COLECCIONES DE FIRABASE  (Estructura Detallada)

Estructura y datos que deberan ser almacenados en el firebase o en un archivo local (Server), y sus datos a importar y conservar para separa las "CAJAS"

EMPRESAS  - CAJA 

{
  id: "empresa_123abc",
  nit: "9001234567",
  nombre: "Tecnología Ejemplo S.A.S.",
  planId: "plan_profesional",
  planNombre: "Profesional",
  fechaCreacion: "2026-01-15T10:30:00Z",
  fechaVencimiento: "2026-02-15T10:30:00Z",
  estado: "activa", // activa, suspendida, cancelada
  maxUsuarios: 50,
  configuracion: {
    idioma: "es",
    zonaHoraria: "America/Bogota",
    moneda: "COP"
  },
  createdBy: "usuario_456def"
}

USUARIO

{
  id: "usuario_456def",
  empresaId: "empresa_123abc",
  nombre: "Carlos Rodríguez",
  email: "carlos@ejemplo.com",
  rol: "jefe", // jefe, director, lider, empleado
  superiorId: null, // null para jefes
  telefono: "+573001234567",
  activo: true,
  fechaIngreso: "2026-01-15T10:35:00Z",
  ultimoAcceso: "2026-03-17T08:20:00Z",
  avatar: "https://storage.firebase.com/avatars/user1.jpg",
  cargo: "CEO",
  departamento: "Dirección General",
  permisos: {
    crearUsuarios: true,
    eliminarUsuarios: true,
    asignarTareas: true,
    verReportes: true
  }
}



EQUIPOS  

{
  id: "equipo_789ghi",
  empresaId: "empresa_123abc",
  nombre: "Ventas Regional",
  descripcion: "Equipo de ventas para la zona norte",
  liderId: "usuario_789ghi",
  area: "Comercial",
  fechaCreacion: "2026-01-20T09:00:00Z",
  miembros: [
    { usuarioId: "usuario_789ghi", rol: "lider", fechaIngreso: "2026-01-20" },
    { usuarioId: "usuario_101jkl", rol: "empleado", fechaIngreso: "2026-01-25" },
    { usuarioId: "usuario_102mno", rol: "empleado", fechaIngreso: "2026-02-01" }
  ],
  activo: true
}


TIPO DE ARQUITECTURA IMPLEMENTADA 

* ARQUITECTURA MONOLÍTICA

Se implementa este tipo de arquitectura porque,Todo el software está unificado en una sola aplicación. La interfaz de usuario, la lógica de negocio y el acceso a datos están en un mismo código base y se despliegan como una sola unidad.


BUENA PORQUE:
    Simple de desarrollar, probar y desplegar inicialmente

    Rendimiento (no hay latencia de red entre componentes)

    Fácil depuración (todo en un solo lugar)

    Transacciones ACID sencillas

    Menos complejidad operativa

MALA PORQUE:
    Escalabilidad limitada (escalar todo o nada)

    Deuda técnica crece con el tiempo

    Tecnología única (difícil cambiar stack)

    Despliegues arriesgados (un error afecta todo)

    Equipos grandes difícil de coordinar



-- OTRAS OPCIONES DE ARQUITECTURA PARA EL PROYECTO SERIAN 


* ARQUITECTURA POR CAPAS

Organiza el código en capas horizontales con responsabilidades específicas. Cada capa solo se comunica con la inmediata inferior.


BUENA PORQUE:
    Separación de responsabilidades clara

    Mantenible (cambiar una capa sin afectar otras)

    Testeable (cada capa por separado)

    Organización intuitiva (fácil de entender)

    Reutilización (capa inferior por múltiples superiores)

MALA PORQUE:
    Rigidez (difícil saltarse capas)

    Performance (sobrecarga de llamadas entre capas)

    Monolítico por naturaleza (tiende a crecer)

    Cambios pueden afectar múltiples capas

    Over-engineering en proyectos pequeños


* ARQUITECTURA CLIENTE-SERVIDOR

Divide la aplicación en clientes que solicitan servicios y servidores que los proveen. Modelo clásico de red.

BUENA PORQUE:
    Simple (modelo probado y entendido)

    Centralizado (control, seguridad)

    Escalable verticalmente (mejorar servidor)

    Múltiples clientes (web, móvil, desktop)

    Seguridad centralizada (autenticación en servidor)

MALA PORQUE:
    Punto único de fallo (servidor caído)

    Cuello de botella (todos al mismo servidor)

    Escalabilidad limitada (vertical)

    Latencia de red (dependencia de conexión)

    Costos de servidor (infraestructura)


POSIBLES STACKS UTILIZABLES PARA SER MÁS VIABLE 


  FRONTEND + BACKEND                          

   Next.js 14 + TypeScript (App Router)                        
   Tailwind CSS + shadcn/ui                                    
   NextAuth.js / Auth.js (Autenticación)                       
   TanStack Query                                               
   Zustand                                                      
   React Hook Form + Zod                                        
   PostgreSQL (Vercel Postgres / Neon)                          
   Prisma ORM                                                   
   UploadThing / Vercel Blob (Archivos)                        
   Resend / Nodemailer (Emails)                                
   Tremor / Recharts (Gráficas)                                
   Vercel (Despliegue)                                          
