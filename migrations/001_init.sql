-- migrations/001_init.sql
------------------------------------------------------------
--  Secuencias
------------------------------------------------------------
CREATE SEQUENCE IF NOT EXISTS public.usuarios_id_seq    START 1;
CREATE SEQUENCE IF NOT EXISTS public.revistas_id_seq    START 1;
CREATE SEQUENCE IF NOT EXISTS public.publicaciones_id_seq START 1;

------------------------------------------------------------
--  Tablas
------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.usuarios (
  id          INT PRIMARY KEY DEFAULT nextval('public.usuarios_id_seq'),
  nombre      VARCHAR(100) NOT NULL,
  correo      VARCHAR(100) NOT NULL UNIQUE,
  "contraseña" TEXT NOT NULL,
  rol         VARCHAR(20)  DEFAULT 'autor'
);

CREATE TABLE IF NOT EXISTS public.revistas (
  id              INT PRIMARY KEY DEFAULT nextval('public.revistas_id_seq'),
  nombre          VARCHAR(150) NOT NULL,
  descripcion     TEXT,
  issn            VARCHAR(20) UNIQUE,
  fecha_creacion  DATE DEFAULT CURRENT_DATE
);

CREATE TABLE IF NOT EXISTS public.publicaciones (
  id                INT PRIMARY KEY DEFAULT nextval('public.publicaciones_id_seq'),
  titulo            VARCHAR(200) NOT NULL,
  resumen           TEXT,
  fecha_publicacion DATE DEFAULT CURRENT_DATE,
  archivo_url       TEXT,
  usuario_id        INT REFERENCES public.usuarios(id) ON DELETE CASCADE,
  revista_id        INT REFERENCES public.revistas(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS public.certificados (
  id SERIAL PRIMARY KEY,
  autor_nombre VARCHAR(100) NOT NULL,
  articulo_titulo VARCHAR(200) NOT NULL,
  articulo_url TEXT, -- Ruta al PDF
  articulo_pagina TEXT, -- URL de la página del artículo
  fecha_emision TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  publicacion_id INT REFERENCES public.publicaciones(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS public.facturas (
  id SERIAL PRIMARY KEY,
  usuario_id INT REFERENCES public.usuarios(id) ON DELETE SET NULL,
  fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  total NUMERIC(10,2) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.factura_items (
  id SERIAL PRIMARY KEY,
  factura_id INT REFERENCES public.facturas(id) ON DELETE CASCADE,
  servicio_nombre VARCHAR(200) NOT NULL,
  cantidad INT NOT NULL,
  precio_unitario NUMERIC(10,2) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.paginas_contenido (
  id SERIAL PRIMARY KEY,
  pagina VARCHAR(50) NOT NULL,         -- Ej: 'contacto', 'editorial', 'nosotros', 'servicios'
  seccion VARCHAR(50) NOT NULL,        -- Ej: 'main', 'footer', 'intro', etc
  titulo VARCHAR(200),                 -- Título de la sección (opcional)
  contenido TEXT NOT NULL,             -- HTML o texto de la sección
  orden INT DEFAULT 0                  -- Para ordenar las secciones si es necesario
);

CREATE TABLE IF NOT EXISTS public.servicios (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(200) NOT NULL,
  descripcion TEXT,
  precio NUMERIC(10,2) NOT NULL,
  activo BOOLEAN DEFAULT TRUE,
  orden INT DEFAULT 0
);
