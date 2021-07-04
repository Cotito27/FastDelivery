CREATE DATABASE IF NOT EXISTS fast_delivery;

use fast_delivery;

CREATE TABLE IF NOT EXISTS clientes (
  codigo INT NOT NULL AUTO_INCREMENT,
  nombres VARCHAR(150) NOT NULL,
  apellido_paterno VARCHAR(90) NOT NULL,
  apellido_materno VARCHAR(90) NOT NULL,
  dni VARCHAR(60) NOT NULL,
  direccion VARCHAR(150),
  telefono VARCHAR(150),
  cod_estado INT NOT NULL,
  correo VARCHAR(150),
  usuario VARCHAR(90),
  pass VARCHAR(90),
  imagen TEXT,
  PRIMARY KEY (codigo)
);

CREATE TABLE IF NOT EXISTS productos (
  codigo INT NOT NULL AUTO_INCREMENT,
  nombre VARCHAR(190) NOT NULL,
  descripcion TEXT,
  precio DOUBLE,
  stock INT,
  cod_establecimiento INT NOT NULL,
  cod_categoria INT NOT NULL,
  unidad_med VARCHAR(130),
  imagen TEXT,
  PRIMARY KEY (codigo)
);

CREATE TABLE IF NOT EXISTS categoria (
  codigo INT NOT NULL AUTO_INCREMENT,
  nombre TEXT,
  descripcion TEXT,
  PRIMARY KEY (codigo)
);

CREATE TABLE IF NOT EXISTS establecimiento (
 codigo INT NOT NULL AUTO_INCREMENT,
 nombre TEXT,
 descripcion TEXT,
 PRIMARY KEY (codigo)
);

CREATE TABLE IF NOT EXISTS empleados (
  codigo INT NOT NULL AUTO_INCREMENT,
  nombres VARCHAR(150),
  apellidos VARCHAR(150),
  cod_cargo INT NOT NULL,
  cod_estado INT NOT NULL,
  domicilio TEXT,
  telefono VARCHAR(12),
  usuario VARCHAR(50),
  pass VARCHAR(50),
  correo TEXT,
  dni VARCHAR(10),
  imagen TEXT,
  PRIMARY KEY (codigo)
);

CREATE TABLE IF NOT EXISTS estado_empleado (
  codigo INT NOT NULL AUTO_INCREMENT,
  nombre TEXT,
  descripcion TEXT,
  PRIMARY KEY (codigo)
);

CREATE TABLE IF NOT EXISTS estado_cliente (
  codigo INT NOT NULL AUTO_INCREMENT,
  nombre TEXT,
  descripcion TEXT,
  PRIMARY KEY (codigo)
);

CREATE TABLE IF NOT EXISTS cargo (
  codigo INT NOT NULL AUTO_INCREMENT,
  nombre TEXT,
  descripcion TEXT,
  PRIMARY KEY (codigo)
);

CREATE TABLE IF NOT EXISTS ticket_solicitud (
  codigo INT NOT NULL AUTO_INCREMENT,
  total DOUBLE,
  descripcion TEXT,
  cod_cliente INT NOT NULL,
  PRIMARY KEY (codigo)
);

CREATE TABLE IF NOT EXISTS detalle_ticket (
  codigo INT NOT NULL,
  cod_prod INT NOT NULL,
  precio_venta_u DOUBLE NOT NULL,
  cantidad DOUBLE NOT NULL,
  codigo_ticket INT NOT NULL
);

CREATE TABLE IF NOT EXISTS boleta (
  codigo INT NOT NULL,
  cod_cliente INT NOT NULL,
  descripcion TEXT,
  fecha_emision TEXT,
  total DOUBLE,
  cod_emp INT NOT NULL,
  PRIMARY KEY (codigo)
);

CREATE TABLE IF NOT EXISTS detalle_boleta (
  codigo INT NOT NULL,
  cod_prod INT NOT NULL,
  precio_venta_u DOUBLE,
  cantidad INT NOT NULL,
  cod_boleta INT NOT NULL
);