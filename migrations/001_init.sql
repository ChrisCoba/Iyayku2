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
