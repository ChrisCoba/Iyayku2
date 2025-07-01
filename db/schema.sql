--
-- PostgreSQL database dump
--

-- Dumped from database version 16.9
-- Dumped by pg_dump version 16.9

-- Started on 2025-06-03 22:03:50

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 220 (class 1259 OID 16424)
-- Name: publicaciones; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.publicaciones (
    id integer NOT NULL,
    titulo character varying(200) NOT NULL,
    resumen text,
    fecha_publicacion date DEFAULT CURRENT_DATE,
    archivo_url text,
    usuario_id integer,
    revista_id integer
);


ALTER TABLE public.publicaciones OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 16423)
-- Name: publicaciones_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.publicaciones_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.publicaciones_id_seq OWNER TO postgres;

--
-- TOC entry 4911 (class 0 OID 0)
-- Dependencies: 219
-- Name: publicaciones_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.publicaciones_id_seq OWNED BY public.publicaciones.id;


--
-- TOC entry 218 (class 1259 OID 16412)
-- Name: revistas; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.revistas (
    id integer NOT NULL,
    nombre character varying(150) NOT NULL,
    descripcion text,
    issn character varying(20),
    fecha_creacion date DEFAULT CURRENT_DATE
);


ALTER TABLE public.revistas OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 16411)
-- Name: revistas_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.revistas_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.revistas_id_seq OWNER TO postgres;

--
-- TOC entry 4912 (class 0 OID 0)
-- Dependencies: 217
-- Name: revistas_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.revistas_id_seq OWNED BY public.revistas.id;


--
-- TOC entry 216 (class 1259 OID 16400)
-- Name: usuarios; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.usuarios (
    id integer NOT NULL,
    nombre character varying(100) NOT NULL,
    correo character varying(100) NOT NULL,
    "contraseña" text NOT NULL,
    rol character varying(20) DEFAULT 'autor'::character varying
);


ALTER TABLE public.usuarios OWNER TO postgres;

--
-- TOC entry 215 (class 1259 OID 16399)
-- Name: usuarios_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.usuarios_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.usuarios_id_seq OWNER TO postgres;

--
-- TOC entry 4913 (class 0 OID 0)
-- Dependencies: 215
-- Name: usuarios_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.usuarios_id_seq OWNED BY public.usuarios.id;


--
-- TOC entry 4749 (class 2604 OID 16427)
-- Name: publicaciones id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.publicaciones ALTER COLUMN id SET DEFAULT nextval('public.publicaciones_id_seq'::regclass);


--
-- TOC entry 4747 (class 2604 OID 16415)
-- Name: revistas id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.revistas ALTER COLUMN id SET DEFAULT nextval('public.revistas_id_seq'::regclass);


--
-- TOC entry 4745 (class 2604 OID 16403)
-- Name: usuarios id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios ALTER COLUMN id SET DEFAULT nextval('public.usuarios_id_seq'::regclass);


--
-- TOC entry 4760 (class 2606 OID 16432)
-- Name: publicaciones publicaciones_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.publicaciones
    ADD CONSTRAINT publicaciones_pkey PRIMARY KEY (id);


--
-- TOC entry 4756 (class 2606 OID 16422)
-- Name: revistas revistas_issn_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.revistas
    ADD CONSTRAINT revistas_issn_key UNIQUE (issn);


--
-- TOC entry 4758 (class 2606 OID 16420)
-- Name: revistas revistas_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.revistas
    ADD CONSTRAINT revistas_pkey PRIMARY KEY (id);


--
-- TOC entry 4752 (class 2606 OID 16410)
-- Name: usuarios usuarios_correo_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_correo_key UNIQUE (correo);


--
-- TOC entry 4754 (class 2606 OID 16408)
-- Name: usuarios usuarios_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_pkey PRIMARY KEY (id);


--
-- TOC entry 4761 (class 2606 OID 16438)
-- Name: publicaciones publicaciones_revista_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.publicaciones
    ADD CONSTRAINT publicaciones_revista_id_fkey FOREIGN KEY (revista_id) REFERENCES public.revistas(id) ON DELETE SET NULL;


--
-- TOC entry 4762 (class 2606 OID 16433)
-- Name: publicaciones publicaciones_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.publicaciones
    ADD CONSTRAINT publicaciones_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id) ON DELETE CASCADE;


--
-- TOC entry 4763 (class 1259 OID 16439)
-- Name: certificados; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.certificados (
    id SERIAL PRIMARY KEY,
    autor_nombre VARCHAR(100) NOT NULL,
    articulo_titulo VARCHAR(200) NOT NULL,
    articulo_url TEXT, -- Ruta al PDF
    articulo_pagina TEXT, -- URL de la página del artículo
    fecha_emision TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    publicacion_id INTEGER REFERENCES public.publicaciones(id) ON DELETE SET NULL
);


ALTER TABLE public.certificados OWNER TO postgres;

-- Completed on 2025-06-03 22:03:50

--
-- PostgreSQL database dump complete
--

