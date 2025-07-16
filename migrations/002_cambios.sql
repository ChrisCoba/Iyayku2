-- Elimina todas las filas existentes de la tabla (cuidado si hay FOREIGN KEYs)
DELETE FROM public.paginas_contenido;
DELETE FROM public.servicios;
-- Reinicia el contador del ID si quieres que los nuevos comiencen desde 1 (opcional)
ALTER SEQUENCE paginas_contenido_id_seq RESTART WITH 1;
ALTER SEQUENCE servicios_id_seq RESTART WITH 1;

-- Inserta la nueva información
INSERT INTO public.paginas_contenido (pagina, seccion, titulo, contenido, orden) VALUES
('nosotros', 'quienes_somos', NULL,
'<section class="nuestros-servicios">
  <div class="servicios-texto">
    <h2>¿Quiénes Somos?</h2>
    <p>Somos una empresa dedicada a brindar soluciones tecnológicas de alta calidad, especializada en la comercialización de equipos de cómputo, capacitación y asesoramiento para empresas tanto del sector público como privado. Con un enfoque centrado en la ética profesional, la responsabilidad y el trato humano, IYAYKU busca atender las diversas necesidades de sus clientes de manera eficiente. Además, la empresa apuesta por el desarrollo continuo de sus colaboradores, fomentando la lealtad, el trabajo en equipo y el compromiso con la sostenibilidad ambiental, asegurando así su rentabilidad y permanencia en el mercado.</p>
  </div>
</section>', 1),

('nosotros', 'quienes_somos_img', NULL,
'<div class="servicios-imagen">
  <img src="/img/acerca" alt="Acerca de Nosotros">
</div>', 2),

('nosotros', 'mision', NULL,
'<section class="mision-nosotros">
  <div class="servicios-imagen">
    <img src="/img/mision" alt="Misión">
  </div>
  <div class="mision-texto">
    <h2>Misión</h2>
    <p>IYAYKU INNOVACIÓN TECNOLÓGICA tiene la misión de ofrecer servicios empresariales de calidad con calidez, ser especialistas en la comercialización de equipos de cómputo, capacitación y asesoría a empresas públicas y privadas, solucionando las diversas necesidades de los clientes, con ética profesional y responsabilidad. La empresa se enfoca en capacitar constantemente a sus colaboradores, promoviendo la lealtad y el trabajo en equipo para asegurar la rentabilidad de la empresa y la sostenibilidad ambiental.</p>
  </div>
</section>', 3),

('nosotros', 'vision', NULL,
'<section class="nuestros-servicios">
  <div class="servicios-texto">
    <h2>Visión</h2>
    <p>Ser una empresa líder en innovación tecnológica, consultoría especializada y producción académica, reconocida por su excelencia, compromiso social y capacidad de adaptación, contribuyendo al fortalecimiento del ecosistema empresarial y educativo a nivel nacional e internacional.</p>
  </div>
  <div class="servicios-imagen">
    <img src="/img/vision" alt="Visión">
  </div>
</section>', 4),

('nosotros', 'footer', NULL,
'<footer class="footer">
  <div class="footer-col">
    <h3>Dirección</h3>
    <p>Dirección: Av. Amazonas y Colón, Quito – Ecuador</p>
  </div>
  <div class="footer-col">
    <h3>Síguenos</h3>
    <div class="footer-socials">
      <a href="https://api.whatsapp.com/send?phone=593997000496&text=%C2%A1Hola%20Iyayku%20Innova%20Editores!%20me%20gustar%C3%ADa%20saber%20m%C3%A1s%20informaci%C3%B3n%20acerca%20de%20la%20asesor%C3%ADa%20y%20publicaci%C3%B3n%20de%20art%C3%ADculos%20cient%C3%ADficos.%20%E2%9C%8D%EF%B8%8F%F0%9F%93%8A%F0%9F%93%9D" target="_blank" rel="noopener noreferrer">
        <img src="/svgs/whatsapp alt="WhatsApp" />
      </a>
      <a href="https://www.facebook.com/Iyaykutec" target="_blank" rel="noopener noreferrer">
        <img src="/svg/facebook" alt="Facebook" />
      </a>
      <a href="https://www.instagram.com/iyaykutec" target="_blank" rel="noopener noreferrer">
        <img src=""/svg/instagram"" alt="Instagram" />
      </a>
    </div>
  </div>
  <div class="footer-col">
    <h3>Información</h3>
    <p>Email: iyayku@gmail.com</p>
    <p>Teléfonos: 0995000484 · 0979369650 · 0997000496</p>
  </div>
</footer>', 99);


-- Servicios dinámicos desde tabla `servicios`
INSERT INTO public.paginas_contenido (pagina, seccion, titulo, contenido, orden) VALUES
('servicios', 'principal', 'Nuestros Servicios',
'<section class="servicios-precios-section"><div class="servicios-precios-container"><h2 class="servicios-precios-title">Nuestros Servicios y Precios</h2><div class="servicios-precios-cards">'
  || (
    SELECT string_agg(
      '<div class="servicio-precio-card card-blue"><div class="servicio-precio-header">' || nombre || '</div><ul><li>' || replace(descripcion, ',', '</li><li>') || '</li></ul><div class="servicio-precio-precio">$' || precio || '</div></div>',
      ''
    )
    FROM servicios WHERE activo = TRUE
  )
  || '</div></div></section>', 1);

-- Editorial
INSERT INTO public.paginas_contenido (pagina, seccion, titulo, contenido, orden) VALUES
('editorial', 'principal', 'Editorial',
'<section class="editoriales"><div class="editorial"><h2>Editorial Innova</h2><p>Editorial Innova es una iniciativa ecuatoriana con visión internacional que nace del compromiso por impulsar la ciencia abierta y democratizar el acceso al conocimiento.  Desde Quito, nuestra editorial se ha consolidado como un espacio de publicación académica confiable, ética y rigurosa, respaldada por un equipo multidisciplinario de profesionales en investigación científica.  Editorial Innova gestiona cuatro revistas científicas: Revista Científica Kosmos, Nexus Research Journal, Revista Ingenio Global y Bastcorp International Journal, todas de acceso abierto, revisión por pares y bajo licencia Creative Commons Atribución 4.0 Internacional.  Cada publicación abarca múltiples disciplinas, desde ingeniería y tecnología hasta ciencias sociales y humanidades, permitiendo una integración real del conocimiento.  Nuestra política editorial prioriza la calidad, la transparencia y la inclusión, ofreciendo a investigadores, docentes y estudiantes una plataforma sólida y confiable para la difusión de sus aportes científicos.  Con un modelo de publicación continua y semestral, fomentamos la visibilidad inmediata de los artículos, respetando siempre los principios de ética editorial y buenas prácticas científicas.  Más allá de publicar, buscamos formar comunidad: una red de pensamiento crítico y colaboración académica que contribuya al desarrollo sostenible, la innovación y el fortalecimiento de la educación superior en América Latina y el mundo.  En Editorial Innova creemos que la ciencia debe ser libre, accesible y transformadora.  Por eso, trabajamos día a día para ser un puente entre el conocimiento emergente y quienes tienen el poder de aplicarlo para mejorar nuestra sociedad.</p><p class="frase-final">¡Innovación que trasciende, ideas que perduran!</p><div class="boton-container"><a href="https://editorialinnova.com/" class="btn-editorial" target="_blank">Visitar Sitio</a></div></div><div class="editorial"><h2>Editorial Sphaera</h2><p>Editorial Sphaera es una editorial académica ecuatoriana con un enfoque moderno, inclusivo y profundamente comprometido con la excelencia científica.  Desde su sede en el corazón de Quito, promovemos un modelo editorial abierto, transparente y orientado a fortalecer la producción investigativa en América Latina.  Nuestra labor se traduce en la gestión de cuatro revistas científicas de acceso abierto:  Horizon International Journal, Alpha International Journal, Impact Research Journal y Ethos Scientific Journal, cada una diseñada para responder a los desafíos actuales del conocimiento en campos como la educación, la salud, la tecnología, la economía, la ingeniería y las humanidades.  Nos regimos por estrictas políticas de revisión por pares, ética editorial y publicación continua, permitiendo a nuestros autores publicar con rapidez, visibilidad global y reconocimiento académico.  En Editorial Sphaera valoramos profundamente el trabajo de los investigadores y ofrecemos un acompañamiento cercano, humano y profesional durante todo el proceso editorial.  Creemos que la divulgación científica debe estar al alcance de todos, sin barreras económicas ni institucionales, por lo que operamos bajo licencia Creative Commons Atribución 4.0 Internacional.  Nuestra visión es clara: construir una comunidad académica sólida, conectada y comprometida con el avance del conocimiento y la transformación social.  Por eso, más que una editorial, somos un puente entre el pensamiento crítico y la acción científica.  En un contexto global que exige innovación, sostenibilidad y colaboración, Editorial Sphaera se posiciona como un aliado estratégico para quienes apuestan por una ciencia libre, ética y con impacto real.</p><div class="boton-container"><a href="https://editorialsphaera.com/" class="btn-editorial" target="_blank">Visitar Sitio</a></div></div></section>', 1);

INSERT INTO public.paginas_contenido (pagina, seccion, titulo, contenido, orden) VALUES
('contacto', 'principal', 'Contacto',
'<div class="contacto-wrapper"><div class="contacto-info"><h1>Trabajemos juntos</h1><p>Completa los campos y te contactaremos en breve.<br>También puedes escribirnos por WhatsApp, Facebook o Instagram.<br><br>Nos especializamos en asesoría, publicaciones y acompañamiento profesional.<br>¡Tu consulta es confidencial!</p></div><section class="contacto"><form id="formularioContacto"><div class="campo"><label for="nombres">Nombre y Apellido*</label><input type="text" id="nombres" name="nombres" placeholder="Nombre y Apellido*" required></div><div class="campo"><label for="telefono">Teléfono*</label><input type="text" id="telefono" name="telefono" placeholder="Teléfono*" maxlength="15" required></div><div class="campo"><label for="correo">Email*</label><input type="email" id="correo" name="correo" placeholder="Email*" required></div><div class="campo"><label for="pais">País*</label><select id="pais" name="pais" required><option value="">Seleccione un país</option></select></div><div class="campo"><label for="ciudad">Ciudad*</label><select id="ciudad" name="ciudad" required><option value="">Seleccione una ciudad</option></select></div><div class="campo"><label for="mensaje">Cuéntanos sobre tu proyecto</label><textarea id="mensaje" name="mensaje" placeholder="Cuéntanos sobre tu proyecto" maxlength="200" required></textarea><small id="mensaje-ayuda">Máximo 200 caracteres.</small></div><div class="campo" style="display:flex;align-items:center;"><input type="checkbox" id="privacidad" name="privacidad" required style="width:1.1em;height:1.1em;margin-right:0.5em;"><label for="privacidad" style="margin:0;display:inline;">He leído y acepto la <a href="#" style="color:#007bff;text-decoration:underline;">Política de Privacidad</a></label></div><button type="submit">Enviar</button></form></section></div>', 1);

INSERT INTO public.paginas_contenido (pagina, seccion, titulo, contenido, orden) VALUES
('inicio', 'principal', 'Inicio',
'<section class="inicio-empresa"><div class="inicio-contenido"><h1>Innovación que trasciende, ideas que perduran</h1><p>En <strong>IYAYKU Innovación Tecnológica</strong> creemos que la tecnología, la ciencia y la educación pueden transformar el presente y proyectar un futuro más sostenible. Somos una empresa ecuatoriana con impacto latinoamericano, especializada en asesoría, capacitación, investigación y soluciones digitales a medida.</p><p>Nuestro equipo multidisciplinario de expertos trabaja con instituciones, universidades, gobiernos y empresas para brindar resultados reales, éticos y de alta calidad. Si estás buscando impulsar tu proyecto, fortalecer tu organización o publicar en las mejores bases científicas, estás en el lugar correcto.</p><a href="#nuestros-servicios" class="btn-principal">Conoce nuestros servicios</a></div><div class="inicio-imagen"><img src="/img/inovacion" alt="Innovación IYAYKU" /></div></section>', 1);

INSERT INTO public.servicios (nombre, descripcion, precio, activo, orden) VALUES
('Proyectos y Planes de Investigación',
'Desarrollo personalizado,Asesoría profesional,Entrega digital',
250, TRUE, 1),

('Tesis Pregrado, Posgrado y Doctorado',
'Redacción y acompañamiento,Formato académico,Revisiones incluidas',
350, TRUE, 2),

('Publicación de Artículos',
'En revistas indexadas,Corrección de estilo,Gestión de DOI',
180, TRUE, 3),

('Libros Digitales y Físicos',
'ISBN y maquetación,Diseño de portada,Publicación internacional',
400, TRUE, 4),

('Tesis como Libro o Artículo',
'Conversión profesional,Publicación en línea,Difusión académica',
220, TRUE, 5);
  <ul>
    <li>Redacción y acompañamiento</li>
    <li>Formato académico</li>
    <li>Revisiones incluidas</li>
  </ul>
  <div class="servicio-precio-precio">$350</div>
  <button class="servicio-precio-btn">Comprar</button>
</div>', 
350, TRUE, 2),

('Publicación de Artículos',
'<div class="servicio-precio-card card-purple">
  <div class="servicio-precio-header">Publicación de Artículos</div>
  <ul>
    <li>En revistas indexadas</li>
    <li>Corrección de estilo</li>
    <li>Gestión de DOI</li>
  </ul>
  <div class="servicio-precio-precio">$180</div>
  <button class="servicio-precio-btn">Comprar</button>
</div>', 
180, TRUE, 3),

('Libros Digitales y Físicos',
'<div class="servicio-precio-card card-orange">
  <div class="servicio-precio-header">Libros Digitales y Físicos</div>
  <ul>
    <li>ISBN y maquetación</li>
    <li>Diseño de portada</li>
    <li>Publicación internacional</li>
  </ul>
  <div class="servicio-precio-precio">$400</div>
  <button class="servicio-precio-btn">Comprar</button>
</div>', 
400, TRUE, 4),

('Tesis como Libro o Artículo',
'<div class="servicio-precio-card card-green">
  <div class="servicio-precio-header">Tesis como Libro o Artículo</div>
  <ul>
    <li>Conversión profesional</li>
    <li>Publicación en línea</li>
    <li>Difusión académica</li>
  </ul>
  <div class="servicio-precio-precio">$220</div>
  <button class="servicio-precio-btn">Comprar</button>
</div>', 
220, TRUE, 5);


