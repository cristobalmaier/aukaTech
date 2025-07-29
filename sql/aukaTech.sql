-- Script de creación de base de datos para AukaTech

CREATE DATABASE IF NOT EXISTS aukaTech;
USE aukaTech;

-- Tabla de roles
CREATE TABLE IF NOT EXISTS roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE
);

-- Tabla de áreas (ubicaciones)
CREATE TABLE IF NOT EXISTS areas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE
);

-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    id_rol INT NOT NULL,
    id_area INT,
    FOREIGN KEY (id_rol) REFERENCES roles(id),
    FOREIGN KEY (id_area) REFERENCES areas(id)
);

-- Tabla de tipos de solicitud
CREATE TABLE IF NOT EXISTS tipos_solicitud (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE
);

-- Tabla de estados de solicitud
CREATE TABLE IF NOT EXISTS estados_solicitud (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE
);

-- Tabla de solicitudes
CREATE TABLE IF NOT EXISTS solicitudes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    id_tipo INT NOT NULL,
    id_area INT NOT NULL,
    prioridad ENUM('Baja', 'Media', 'Urgente') NOT NULL,
    descripcion TEXT,
    id_estado INT NOT NULL,
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id),
    FOREIGN KEY (id_tipo) REFERENCES tipos_solicitud(id),
    FOREIGN KEY (id_area) REFERENCES areas(id),
    FOREIGN KEY (id_estado) REFERENCES estados_solicitud(id)
);

-- Datos de ejemplo para roles
INSERT IGNORE INTO roles (nombre) VALUES ('Empleado'), ('Soporte'), ('Administrador');

-- Datos de ejemplo para áreas
INSERT IGNORE INTO areas (nombre) VALUES ('Recepción'), ('Sala de Reuniones'), ('Oficina Principal'), ('Cafetería');

-- Datos de ejemplo para tipos de solicitud
INSERT IGNORE INTO tipos_solicitud (nombre) VALUES ('IT'), ('Mantenimiento'), ('Limpieza'), ('Administración');

-- Datos de ejemplo para estados de solicitud
INSERT IGNORE INTO estados_solicitud (nombre) VALUES ('Pendiente'), ('En camino'), ('Atendida'), ('Cancelada'); 