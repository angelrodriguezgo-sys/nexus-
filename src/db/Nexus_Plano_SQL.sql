-- base de datos nexus 
create database NEXUS;

use NEXUS;


CREATE TABLE PLANES (
	Planes_id VARCHAR(30) primary key,
    nombre VARCHAR(30) not null,
    descripcion text,
    precio DECIMAL(10, 2) not null,
    precio_anual DECIMAL(10, 2),
    max_usuarios int not null,
    almacenamiento_gb int not null default 20,
    roles_disponibles VARCHAR(20) NOT NULL CHECK (roles_disponibles IN ('ceo', 'director', 'lider', 'empleado')),
    caracteristicas TEXT,
    Creacion TIMESTAMP DEFAULT NOW(),
    Actualizacion TIMESTAMP
);

-- 2. EMPRESAS
CREATE TABLE EMPRESAS (
    NIT VARCHAR(30) primary key unique not null,
    Nombre_Empresa VARCHAR(150) not null,
    Plan_id varchar(30),
    foreign key (Plan_id) references PLANES(Planes_id),
    capacidad_max int,
    moneda varchar(10) default 'COP',
    fecha_compra TIMESTAMP DEFAULT NOW(),
    fecha_limite_plan TIMESTAMP,
    estado VARCHAR(20) DEFAULT 'activa' CHECK (estado IN ('activa', 'suspendida', 'cancelada')),
    Creaacion TIMESTAMP DEFAULT NOW(),
    Actualizacion TIMESTAMP
);

-- 3. USUARIOS (Empleados)
CREATE TABLE USUARIOS (
	DNI varchar(30) primary key unique not null,
    Empresa_ID varchar(30),
    foreign key (Empresa_ID)REFERENCES EMPRESAS(NIT),
    email VARCHAR(100) UNIQUE NOT NULL,
    nombre VARCHAR(80) NOT NULL,
    apellido VARCHAR(80) NOT NULL,
    celular VARCHAR(20),
    fecha_nacimiento DATE,
    rol VARCHAR(20) NOT NULL CHECK (rol IN ('ceo', 'director', 'lider', 'empleado')),
    area VARCHAR(100),
    superior_id VARCHAR(30),
    foreign key (superior_id) references USUARIOS(DNI),
    activo BOOLEAN DEFAULT true,
    fecha_ingreso TIMESTAMP DEFAULT NOW(),
    ultimo_acceso TIMESTAMP,
    Creacion TIMESTAMP DEFAULT NOW(),
    Actualizacion TIMESTAMP
);

-- 4. EQUIPOS
CREATE TABLE EQUIPOS (
    Id_Equipo VARCHAR(30)  primary key ,
	Empresa_ID varchar(30),
    foreign key (Empresa_ID) REFERENCES EMPRESAS(NIT),
    nombre VARCHAR(100) NOT NULL,
	Lider_id VARCHAR(30),
    foreign key (Lider_id) references USUARIOS(DNI),
    area VARCHAR(100),
    activo BOOLEAN DEFAULT true,
    Creacion TIMESTAMP DEFAULT NOW(),
    Renovacion TIMESTAMP
);

-- 5. EQUIPO_MIEMBROS (Relación muchos a muchos entre usuarios y equipos)
CREATE TABLE EQUIPO_MIEMBROS (
    Numero_id VARCHAR(30) PRIMARY KEY,
    equipo_id VARCHAR(30) NOT NULL,
    foreign key (equipo_id) REFERENCES EQUIPOS(Id_Equipo),
    miembro_id VARCHAR(30) NOT NULL,
    foreign key (miembro_id) REFERENCES USUARIOS(DNI) ,
    rol_en_equipo VARCHAR(30) DEFAULT 'miembro',
    fecha_asignacion TIMESTAMP DEFAULT NOW(),
    activo BOOLEAN DEFAULT true,
    UNIQUE(equipo_id, miembro_id)
);

-- 6. TAREAS
CREATE TABLE TAREAS (
    Tarea_Num VARCHAR(30)  PRIMARY KEY,
    titulo VARCHAR(100) NOT NULL,
    descripcion TEXT,
    creador_id VARCHAR(30) not null,
    foreign key (creador_id) references USUARIOS(DNI) , 
    Equipo_Asignado VARCHAR(30) not null,
	foreign key (Equipo_Asignado)  REFERENCES EQUIPOS(Id_Equipo),
    fecha_creacion TIMESTAMP DEFAULT NOW(),
    fecha_limite TIMESTAMP,
    fecha_completada TIMESTAMP,
    prioridad VARCHAR(20) DEFAULT 'media' CHECK (prioridad IN ('baja', 'media', 'alta', 'urgente')),
    estado VARCHAR(20) DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'en_progreso', 'completada', 'atrasada', 'cancelada')),
    activo BOOLEAN DEFAULT true,
    Creacion TIMESTAMP DEFAULT NOW(),
    Actualizacion_Fecha TIMESTAMP
);

-- 7. TAREAS_ASIGNADAS (Relación muchos a muchos entre tareas y usuarios asignados)
CREATE TABLE TAREAS_ASIGNADAS (
    Asignacion VARCHAR(30)  PRIMARY KEY ,
    tarea_id VARCHAR(30) not null ,
    foreign key (tarea_id) references TAREAS(Tarea_Num),
    usuario_id VARCHAR(30) not null,
	foreign key (usuario_id) references USUARIOS(DNI),
    estado VARCHAR(20) DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'en_progreso', 'completada')),
    fecha_asignacion TIMESTAMP DEFAULT NOW(),
    fecha_inicio TIMESTAMP,
    fecha_fin TIMESTAMP,
    activo BOOLEAN DEFAULT true,
    UNIQUE(tarea_id, usuario_id)
);


-- 8. TABLA ARCHIVOS (Relacion Tareas - Archivo )

CREATE TABLE ARCHIVOS (
    Num_Archivo VARCHAR(30) PRIMARY KEY,
    empresa_id VARCHAR(30) NOT NULL,
    FOREIGN KEY (empresa_id) REFERENCES EMPRESAS(NIT),
    tarea_id VARCHAR(30),
    FOREIGN KEY (tarea_id) REFERENCES TAREAS(Tarea_Num),
    usuario_id VARCHAR(30) NOT NULL,
    FOREIGN KEY (usuario_id) REFERENCES USUARIOS(DNI),
    nombre VARCHAR(200) NOT NULL,
    tipo VARCHAR(50),
    tamaño INT,
    url TEXT NOT NULL,
    fecha_subida TIMESTAMP DEFAULT NOW(),
    activo BOOLEAN DEFAULT TRUE
);




