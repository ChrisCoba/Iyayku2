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


-- Contenido demo para la página "Nosotros"
INSERT INTO public.paginas_contenido (pagina, seccion, titulo, contenido, orden) VALUES
('nosotros', 'quienes_somos', '¿Quiénes Somos?',
'<p>Somos una empresa dedicada a brindar soluciones tecnológicas de alta calidad, especializada en la comercialización de equipos de cómputo, capacitación y asesoramiento para empresas tanto del sector público como privado. Con un enfoque centrado en la ética profesional, la responsabilidad y el trato humano, IYAYKU busca atender las diversas necesidades de sus clientes de manera eficiente. Además, la empresa apuesta por el desarrollo continuo de sus colaboradores, fomentando la lealtad, el trabajo en equipo y el compromiso con la sostenibilidad ambiental, asegurando así su rentabilidad y permanencia en el mercado.</p>', 1),
('nosotros', 'quienes_somos_img', NULL, '<img src="/Images/AcercaNosotros.png" alt="Acerca de Nosotros">', 2),
('nosotros', 'mision', 'Misión',
'<p>IYAYKU INNOVACIÓN TECNOLÓGICA tiene la misión de ofrecer servicios empresariales de calidad con calidez, ser especialistas en la comercialización de equipos de cómputo, capacitación y asesoría a empresas públicas y privadas, solucionando las diversas necesidades de los clientes, con ética profesional y responsabilidad. La empresa se enfoca en capacitar constantemente a sus colaboradores, promoviendo la lealtad y el trabajo en equipo para asegurar la rentabilidad de la empresa y la sostenibilidad ambiental.</p>', 3),
('nosotros', 'mision_img', NULL, '<img src="/Images/mision.png" alt="Mision">', 4),
('nosotros', 'vision', 'Visión',
'<p>Ser una empresa líder en innovación tecnológica, consultoría especializada y producción académica, reconocida por su excelencia, compromiso social y capacidad de adaptación, contribuyendo al fortalecimiento del ecosistema empresarial y educativo a nivel nacional e internacional.</p>', 5),
('nosotros', 'vision_img', NULL, '<img src="/Images/vision.png" alt="Visión">', 6),
('nosotros', 'footer', NULL, '<footer class="footer">\n  <div class="footer-col">\n    <h3>Dirección</h3>\n    <p>Dirección: Av. Amazonas y Colón, Quito – Ecuador</p>\n  </div>\n  <div class="footer-col">\n    <h3>Síguenos</h3>\n    <div class="footer-socials">\n      <a href="https://api.whatsapp.com/send?phone=593997000496&text=%C2%A1Hola%20Iyayku%20Innova%20Editores!%20me%20gustar%C3%ADa%20saber%20m%C3%A1s%20informaci%C3%B3n%20acerca%20de%20la%20asesor%C3%ADa%20y%20publicaci%C3%B3n%20de%20art%C3%ADculos%20cient%C3%ADficos.%20%E2%9C%8D%EF%B8%8F%F0%9F%93%8A%F0%9F%93%9D" target="_blank" rel="noopener noreferrer">\n        <img src="/svgs/whatsapp_black_logo_icon_147050.svg" alt="WhatsApp" />\n      </a>\n      <a href="https://www.facebook.com/Iyaykutec" target="_blank" rel="noopener noreferrer">\n        <img src="/svgs/facebook_black_logo_icon_147136.svg" alt="Facebook" />\n      </a>\n      <a href="https://www.instagram.com/iyaykutec" target="_blank" rel="noopener noreferrer">\n        <img src="/svgs/instagram_black_logo_icon_147122.svg" alt="Instagram" />\n      </a>\n    </div>\n  </div>\n  <div class="footer-col">\n    <h3>Información</h3>\n    <p>Email: iyayku@gmail.com</p>\n    <p>Teléfonos: 0995000484 · 0979369650 · 0997000496</p>\n  </div>\n</footer>', 99);

-- Contenido demo para la página "Servicios"
INSERT INTO public.paginas_contenido (pagina, seccion, titulo, contenido, orden) VALUES
('servicios', 'principal', 'Nuestros Servicios',
'<section class="nuestros-servicios">\n  <div class="servicios-texto">\n    <h2>Nuestros Servicios</h2>\n    <p> Nuestro equipo de especialistas en publicaciones científicas está dedicado a nutrir tu trabajo desde la idea inicial hasta su publicación en revistas de alto impacto</p>\n    <ul>\n      <li>Desarrollo de proyectos y planes de investigación</li>\n      <li>Desarrollo de Tesis de Pregrado, Posgrado y Doctorado</li>\n      <li>Publicación de artículos en: SCOPUS (Q1-Q4), WoS, Scielo, Latindex Catálogo 2.0, otros</li>\n      <li>Publicación de libros digitales y físicos</li>\n      <li>Publicación de Tesis como libro o artículo científico</li>\n      <li>Creación de revistas científicas a nivel nacional e internacional</li>\n      <li>Asesorías para Indexación de revistas en Latindex 2.0, Scielo y Scopus</li>\n      <li>Capacitación personalizada en todas las áreas</li>\n    </ul>\n  </div>\n  <div class="servicios-imagen">\n    <img src="/Images/servicios.jpg" alt="Nuestros Servicios">\n  </div>\n</section>', 1);

-- Contenido demo para la página "Editorial"
INSERT INTO public.paginas_contenido (pagina, seccion, titulo, contenido, orden) VALUES
('editorial', 'principal', 'Editorial',
'<section class="editoriales">\n  <div class="editorial">\n    <h2>Editorial Innova</h2>\n    <p>Editorial Innova es una editorial académica ecuatoriana, fundada y dirigida por profesionales especializados en investigación, que forman parte de la empresa Iyayku Innovación Tecnológica Iyaykutec Cía. Ltda. Esta editorial brinda a la comunidad científica cuatro revistas arbitradas, de acceso abierto, con una periodicidad semestral y un formato de publicación continua. Las revistas son editadas en Ecuador y cubren una amplia variedad de disciplinas.</p>\n    <p class="frase-final">¡Innovación que trasciende, ideas que perduran!</p>\n    <div class="boton-container">\n      <a href="https://editorialinnova.com/" class="btn-editorial" target="_blank">Visitar Sitio</a>\n    </div>\n  </div>\n  <div class="editorial">\n    <h2>Editorial Sphaera</h2>\n    <p>Editorial Sphaera es una editorial académica ecuatoriana, fundada y dirigida por profesionales especializados en investigación, que forman parte de la empresa Iyayku Innovación Tecnológica Iyaykutec Cía. Ltda. Esta editorial brinda a la comunidad científica cuatro revistas arbitradas, de acceso abierto, con una periodicidad semestral y un formato de publicación continua. Las revistas son editadas en Ecuador y cubren una amplia variedad de disciplinas.</p>\n    <div class="boton-container">\n      <a href="https://editorialsphaera.com/" class="btn-editorial" target="_blank">Visitar Sitio</a>\n    </div>\n  </div>\n</section>', 1);

-- Contenido demo para la página "Contacto"
INSERT INTO public.paginas_contenido (pagina, seccion, titulo, contenido, orden) VALUES
('contacto', 'principal', 'Contacto',
'<div class="contacto-wrapper">\n  <div class="contacto-info">\n    <h1>Trabajemos juntos</h1>\n    <p>Completa los campos y te contactaremos en breve.<br>También puedes escribirnos por WhatsApp, Facebook o Instagram.<br><br>Nos especializamos en asesoría, publicaciones y acompañamiento profesional.<br>¡Tu consulta es confidencial!</p>\n  </div>\n  <section class="contacto">\n    <form id="formularioContacto">\n      <div class="campo">\n        <label for="nombres">Nombre y Apellido*</label>\n        <input type="text" id="nombres" name="nombres" placeholder="Nombre y Apellido*" required>\n      </div>\n      <div class="campo">\n        <label for="telefono">Teléfono*</label>\n        <input type="text" id="telefono" name="telefono" placeholder="Teléfono*" maxlength="15" required>\n      </div>\n      <div class="campo">\n        <label for="correo">Email*</label>\n        <input type="email" id="correo" name="correo" placeholder="Email*" required>\n      </div>\n      <div class="campo">\n        <label for="pais">País*</label>\n        <select id="pais" name="pais" required>\n          <option value="">Seleccione un país</option>\n        </select>\n      </div>\n      <div class="campo">\n        <label for="ciudad">Ciudad*</label>\n        <select id="ciudad" name="ciudad" required>\n          <option value="">Seleccione una ciudad</option>\n        </select>\n      </div>\n      <div class="campo">\n        <label for="mensaje">Cuéntanos sobre tu proyecto</label>\n        <textarea id="mensaje" name="mensaje" placeholder="Cuéntanos sobre tu proyecto" maxlength="200" required></textarea>\n        <small id="mensaje-ayuda">Máximo 200 caracteres.</small>\n      </div>\n      <div class="campo" style="display:flex;align-items:center;">\n        <input type="checkbox" id="privacidad" name="privacidad" required style="width:1.1em;height:1.1em;margin-right:0.5em;">\n        <label for="privacidad" style="margin:0;display:inline;">He leído y acepto la <a href="#" style="color:#007bff;text-decoration:underline;">Política de Privacidad</a></label>\n      </div>\n      <button type="submit">Enviar</button>\n    </form>\n  </section>\n</div>', 1);

-- Contenido demo para la página "Inicio"
INSERT INTO public.paginas_contenido (pagina, seccion, titulo, contenido, orden) VALUES
('inicio', 'principal', 'Inicio',
'<section class="inicio-empresa">\n  <div class="inicio-contenido">\n    <h1>Innovación que trasciende, ideas que perduran</h1>\n    <p>En <strong>IYAYKU Innovación Tecnológica</strong> creemos que la tecnología, la ciencia y la educación pueden transformar el presente y proyectar un futuro más sostenible. Somos una empresa ecuatoriana con impacto latinoamericano, especializada en asesoría, capacitación, investigación y soluciones digitales a medida.</p>\n    <p>Nuestro equipo multidisciplinario de expertos trabaja con instituciones, universidades, gobiernos y empresas para brindar resultados reales, éticos y de alta calidad. Si estás buscando impulsar tu proyecto, fortalecer tu organización o publicar en las mejores bases científicas, estás en el lugar correcto.</p>\n    <a href="#nuestros-servicios" class="btn-principal">Conoce nuestros servicios</a>\n  </div>\n  <div class="inicio-imagen">\n    <img src="/Images/Inovacion.jpg" alt="Innovación IYAYKU" />\n  </div>\n</section>', 1);
