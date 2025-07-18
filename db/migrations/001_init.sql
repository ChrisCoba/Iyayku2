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

-- Tabla de pedidos para revisión de documentos
CREATE TABLE IF NOT EXISTS public.pedidos (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER REFERENCES public.usuarios(id) ON DELETE SET NULL,
    factura_id INTEGER REFERENCES public.facturas(id) ON DELETE SET NULL,
    requerimiento TEXT,
    descripcion TEXT,
    pdf_requerimiento TEXT,
    pdf_documento TEXT,
    pdf_correccion TEXT,
    comentarios TEXT,
    estado VARCHAR(20) DEFAULT 'pendiente',
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE facturas ADD COLUMN IF NOT EXISTS pdf_url TEXT;

-- Bloques seguros para evitar duplicados en paginas_contenido
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM public.paginas_contenido WHERE pagina = 'nosotros' AND seccion = 'quienes_somos') THEN
        INSERT INTO public.paginas_contenido (pagina, seccion, titulo, contenido, orden) VALUES
        ('nosotros', 'quienes_somos', '¿Quiénes Somos?',
        '<p>Somos una empresa dedicada a brindar soluciones tecnológicas de alta calidad, especializada en la comercialización de equipos de cómputo, capacitación y asesoramiento para empresas tanto del sector público como privado. Con un enfoque centrado en la ética profesional, la responsabilidad y el trato humano, IYAYKU busca atender las diversas necesidades de sus clientes de manera eficiente. Además, la empresa apuesta por el desarrollo continuo de sus colaboradores, fomentando la lealtad, el trabajo en equipo y el compromiso con la sostenibilidad ambiental, asegurando así su rentabilidad y permanencia en el mercado.</p>', 1);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM public.paginas_contenido WHERE pagina = 'nosotros' AND seccion = 'quienes_somos_img') THEN
        INSERT INTO public.paginas_contenido (pagina, seccion, titulo, contenido, orden) VALUES
        ('nosotros', 'quienes_somos_img', NULL, '<img src="/img/acerca" alt="Acerca de Nosotros">', 2);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM public.paginas_contenido WHERE pagina = 'nosotros' AND seccion = 'mision') THEN
        INSERT INTO public.paginas_contenido (pagina, seccion, titulo, contenido, orden) VALUES
        ('nosotros', 'mision', 'Misión',
        '<p>IYAYKU INNOVACIÓN TECNOLÓGICA tiene la misión de ofrecer servicios empresariales de calidad con calidez, ser especialistas en la comercialización de equipos de cómputo, capacitación y asesoría a empresas públicas y privadas, solucionando las diversas necesidades de los clientes, con ética profesional y responsabilidad. La empresa se enfoca en capacitar constantemente a sus colaboradores, promoviendo la lealtad y el trabajo en equipo para asegurar la rentabilidad de la empresa y la sostenibilidad ambiental.</p>', 3);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM public.paginas_contenido WHERE pagina = 'nosotros' AND seccion = 'mision_img') THEN
        INSERT INTO public.paginas_contenido (pagina, seccion, titulo, contenido, orden) VALUES
        ('nosotros','mision_img', NULL,'<img src="/img/mision" alt="Mision">', 4);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM public.paginas_contenido WHERE pagina = 'nosotros' AND seccion = 'vision') THEN
        INSERT INTO public.paginas_contenido (pagina, seccion, titulo, contenido, orden) VALUES
        ('nosotros','vision', 'Visión',
        '<p>Ser una empresa líder en innovación tecnológica, consultoría especializada y producción académica, reconocida por su excelencia, compromiso social y capacidad de adaptación, contribuyendo al fortalecimiento del ecosistema empresarial y educativo a nivel nacional e internacional.</p>', 5);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM public.paginas_contenido WHERE pagina = 'nosotros' AND seccion = 'vision_img') THEN
        INSERT INTO public.paginas_contenido (pagina, seccion, titulo, contenido, orden) VALUES
        ('nosotros', 'vision_img', NULL, '<img src="/img/vision" alt="Visión">', 6);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM public.paginas_contenido WHERE pagina = 'nosotros' AND seccion = 'footer') THEN
        INSERT INTO public.paginas_contenido (pagina, seccion, titulo, contenido, orden) VALUES
        ('nosotros', 'footer', NULL, '<footer class="footer"><div class="footer-col"><h3>Dirección</h3><p>Dirección: Av. Amazonas y Colón, Quito – Ecuador</p></div><div class="footer-col"><h3>Síguenos</h3><div class="footer-socials"><a href="https://api.whatsapp.com/send?phone=593997000496&text=%C2%A1Hola%20Iyayku%20Innova%20Editores!%20me%20gustar%C3%ADa%20saber%20m%C3%A1s%20informaci%C3%B3n%20acerca%20de%20la%20asesor%C3%ADa%20y%20publicaci%C3%B3n%20de%20art%C3%ADculos%20cient%C3%ADficos.%20%E2%9C%8D%EF%B8%8F%F0%9F%93%8A%F0%9F%93%9D" target="_blank" rel="noopener noreferrer"><img src="/svgs/whatsapp_black_logo_icon_147050.svg" alt="WhatsApp" /></a><a href="https://www.facebook.com/Iyaykutec" target="_blank" rel="noopener noreferrer"><img src="/svgs/facebook_black_logo_icon_147136.svg" alt="Facebook" /></a><a href="https://www.instagram.com/iyaykutec" target="_blank" rel="noopener noreferrer"><img src="/svgs/instagram_black_logo_icon_147122.svg" alt="Instagram" /></a></div></div><div class="footer-col"><h3>Información</h3><p>Email: iyayku@gmail.com</p><p>Teléfonos: 0995000484 · 0979369650 · 0997000496</p></div></footer>', 99);
    END IF;
END $$;


DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM public.paginas_contenido WHERE pagina = 'servicios' AND seccion = 'principal') THEN
        INSERT INTO public.paginas_contenido (pagina, seccion, titulo, contenido, orden) VALUES
        ('servicios', 'principal', 'Nuestros Servicios',
        '<section class="servicios-precios-section"><div class="servicios-precios-container"><h2 class="servicios-precios-title">Nuestros Servicios y Precios</h2><div class="servicios-precios-cards">'
          || (
            SELECT string_agg(
              '<div class="servicio-precio-card card-blue"><div class="servicio-precio-header">' || nombre || '</div><ul><li>' || replace(descripcion, ',', '</li><li>') || '</li></ul><div class="servicio-precio-precio">$' || precio || '</div></div>'
              , '')
            FROM servicios WHERE activo = TRUE
          )
          || '</div></div></section>', 1);
    END IF;
END $$;


DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM public.paginas_contenido WHERE pagina = 'editorial' AND seccion = 'principal') THEN
        INSERT INTO public.paginas_contenido (pagina, seccion, titulo, contenido, orden) VALUES
        ('editorial', 'principal', 'Editorial',
        '<section class="editoriales"><div class="editorial"><h2>Editorial Innova</h2><p>Editorial Innova es una iniciativa ecuatoriana con visión internacional que nace del compromiso por impulsar la ciencia abierta y democratizar el acceso al conocimiento.  Desde Quito, nuestra editorial se ha consolidado como un espacio de publicación académica confiable, ética y rigurosa, respaldada por un equipo multidisciplinario de profesionales en investigación científica.  Editorial Innova gestiona cuatro revistas científicas: Revista Científica Kosmos, Nexus Research Journal, Revista Ingenio Global y Bastcorp International Journal, todas de acceso abierto, revisión por pares y bajo licencia Creative Commons Atribución 4.0 Internacional.  Cada publicación abarca múltiples disciplinas, desde ingeniería y tecnología hasta ciencias sociales y humanidades, permitiendo una integración real del conocimiento.  Nuestra política editorial prioriza la calidad, la transparencia y la inclusión, ofreciendo a investigadores, docentes y estudiantes una plataforma sólida y confiable para la difusión de sus aportes científicos.  Con un modelo de publicación continua y semestral, fomentamos la visibilidad inmediata de los artículos, respetando siempre los principios de ética editorial y buenas prácticas científicas.  Más allá de publicar, buscamos formar comunidad: una red de pensamiento crítico y colaboración académica que contribuya al desarrollo sostenible, la innovación y el fortalecimiento de la educación superior en América Latina y el mundo.  En Editorial Innova creemos que la ciencia debe ser libre, accesible y transformadora.  Por eso, trabajamos día a día para ser un puente entre el conocimiento emergente y quienes tienen el poder de aplicarlo para mejorar nuestra sociedad.</p><p class="frase-final">¡Innovación que trasciende, ideas que perduran!</p><div class="boton-container"><a href="https://editorialinnova.com/" class="btn-editorial" target="_blank">Visitar Sitio</a></div></div><div class="editorial"><h2>Editorial Sphaera</h2><p>Editorial Sphaera es una editorial académica ecuatoriana con un enfoque moderno, inclusivo y profundamente comprometido con la excelencia científica.  Desde su sede en el corazón de Quito, promovemos un modelo editorial abierto, transparente y orientado a fortalecer la producción investigativa en América Latina.  Nuestra labor se traduce en la gestión de cuatro revistas científicas de acceso abierto:  Horizon International Journal, Alpha International Journal, Impact Research Journal y Ethos Scientific Journal, cada una diseñada para responder a los desafíos actuales del conocimiento en campos como la educación, la salud, la tecnología, la economía, la ingeniería y las humanidades.  Nos regimos por estrictas políticas de revisión por pares, ética editorial y publicación continua, permitiendo a nuestros autores publicar con rapidez, visibilidad global y reconocimiento académico.  En Editorial Sphaera valoramos profundamente el trabajo de los investigadores y ofrecemos un acompañamiento cercano, humano y profesional durante todo el proceso editorial.  Creemos que la divulgación científica debe estar al alcance de todos, sin barreras económicas ni institucionales, por lo que operamos bajo licencia Creative Commons Atribución 4.0 Internacional.  Nuestra visión es clara: construir una comunidad académica sólida, conectada y comprometida con el avance del conocimiento y la transformación social.  Por eso, más que una editorial, somos un puente entre el pensamiento crítico y la acción científica.  En un contexto global que exige innovación, sostenibilidad y colaboración, Editorial Sphaera se posiciona como un aliado estratégico para quienes apuestan por una ciencia libre, ética y con impacto real.</p><div class="boton-container"><a href="https://editorialsphaera.com/" class="btn-editorial" target="_blank">Visitar Sitio</a></div></div></section>', 1);
    END IF;
END $$;


DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM public.paginas_contenido WHERE pagina = 'contacto' AND seccion = 'principal') THEN
        INSERT INTO public.paginas_contenido (pagina, seccion, titulo, contenido, orden) VALUES
        ('contacto', 'principal', 'Contacto',
        '<div class="contacto-wrapper"><div class="contacto-info"><h1>Trabajemos juntos</h1><p>Completa los campos y te contactaremos en breve.<br>También puedes escribirnos por WhatsApp, Facebook o Instagram.<br><br>Nos especializamos en asesoría, publicaciones y acompañamiento profesional.<br>¡Tu consulta es confidencial!</p></div><section class="contacto"><form id="formularioContacto"><div class="campo"><label for="nombres">Nombre y Apellido*</label><input type="text" id="nombres" name="nombres" placeholder="Nombre y Apellido*" required></div><div class="campo"><label for="telefono">Teléfono*</label><input type="text" id="telefono" name="telefono" placeholder="Teléfono*" maxlength="15" required></div><div class="campo"><label for="correo">Email*</label><input type="email" id="correo" name="correo" placeholder="Email*" required></div><div class="campo"><label for="pais">País*</label><select id="pais" name="pais" required><option value="">Seleccione un país</option></select></div><div class="campo"><label for="ciudad">Ciudad*</label><select id="ciudad" name="ciudad" required><option value="">Seleccione una ciudad</option></select></div><div class="campo"><label for="mensaje">Cuéntanos sobre tu proyecto</label><textarea id="mensaje" name="mensaje" placeholder="Cuéntanos sobre tu proyecto" maxlength="200" required></textarea><small id="mensaje-ayuda">Máximo 200 caracteres.</small></div><div class="campo" style="display:flex;align-items:center;"><input type="checkbox" id="privacidad" name="privacidad" required style="width:1.1em;height:1.1em;margin-right:0.5em;"><label for="privacidad" style="margin:0;display:inline;">He leído y acepto la <a href="#" style="color:#007bff;text-decoration:underline;">Política de Privacidad</a></label></div><button type="submit">Enviar</button></form></section></div>', 1);
    END IF;
END $$;


DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM public.paginas_contenido WHERE pagina = 'inicio' AND seccion = 'principal') THEN
        INSERT INTO public.paginas_contenido (pagina, seccion, titulo, contenido, orden) VALUES
        ('inicio', 'principal', 'Inicio',
        '<section class="inicio-empresa"><div class="inicio-contenido"><h1>Innovación que trasciende, ideas que perduran</h1><p>En <strong>IYAYKU Innovación Tecnológica</strong> creemos que la tecnología, la ciencia y la educación pueden transformar el presente y proyectar un futuro más sostenible. Somos una empresa ecuatoriana con impacto latinoamericano, especializada en asesoría, capacitación, investigación y soluciones digitales a medida.</p><p>Nuestro equipo multidisciplinario de expertos trabaja con instituciones, universidades, gobiernos y empresas para brindar resultados reales, éticos y de alta calidad. Si estás buscando impulsar tu proyecto, fortalecer tu organización o publicar en las mejores bases científicas, estás en el lugar correcto.</p><a href="#nuestros-servicios" class="btn-principal">Conoce nuestros servicios</a></div><div class="inicio-imagen"><img src="/img/inovacion" alt="Innovación IYAYKU" /></div></section>', 1);
    END IF;
END $$;

INSERT INTO public.paginas_contenido (pagina, seccion, titulo, contenido, orden)
SELECT 'nosotros', 'quienes_somos', '¿Quiénes Somos?', '<p>...</p>', 1
WHERE NOT EXISTS (
  SELECT 1 FROM public.paginas_contenido WHERE pagina = 'nosotros' AND seccion = 'quienes_somos'
);
