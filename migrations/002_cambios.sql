-- Elimina todas las filas existentes de la tabla (cuidado si hay FOREIGN KEYs)
DELETE FROM public.paginas_contenido;

-- Reinicia el contador del ID si quieres que los nuevos comiencen desde 1 (opcional)
ALTER SEQUENCE paginas_contenido_id_seq RESTART WITH 1;

-- Inserta la nueva información
INSERT INTO public.paginas_contenido (pagina, seccion, titulo, contenido, orden) VALUES
('nosotros', 'quienes_somos', '¿Quiénes Somos?', 
'<p>Somos una empresa dedicada a brindar soluciones tecnológicas de alta calidad, especializada en la comercialización de equipos de cómputo, capacitación y asesoramiento para empresas tanto del sector público como privado. Con un enfoque centrado en la ética profesional, la responsabilidad y el trato humano, IYAYKU busca atender las diversas necesidades de sus clientes de manera eficiente. Además, la empresa apuesta por el desarrollo continuo de sus colaboradores, fomentando la lealtad, el trabajo en equipo y el compromiso con la sostenibilidad ambiental, asegurando así su rentabilidad y permanencia en el mercado.</p>', 1),
('nosotros', 'quienes_somos_img', NULL, '<img src="/img/acerca" alt="Acerca de Nosotros">', 2),
('nosotros', 'mision', 'Misión', 
'<p>IYAYKU INNOVACIÓN TECNOLÓGICA tiene la misión de ofrecer servicios empresariales de calidad con calidez, ser especialistas en la comercialización de equipos de cómputo, capacitación y asesoría a empresas públicas y privadas, solucionando las diversas necesidades de los clientes, con ética profesional y responsabilidad. La empresa se enfoca en capacitar constantemente a sus colaboradores, promoviendo la lealtad y el trabajo en equipo para asegurar la rentabilidad de la empresa y la sostenibilidad ambiental.</p>', 3),
('nosotros', 'mision_img', NULL, '<img src="/img/mision" alt="Mision">', 4),
('nosotros', 'vision', 'Visión', 
'<p>Ser una empresa líder en innovación tecnológica, consultoría especializada y producción académica, reconocida por su excelencia, compromiso social y capacidad de adaptación, contribuyendo al fortalecimiento del ecosistema empresarial y educativo a nivel nacional e internacional.</p>', 5),
('nosotros', 'vision_img', NULL, '<img src="/img/vision" alt="Visión">', 6),
('nosotros', 'footer', NULL, '<footer class="footer"><div class="footer-col"><h3>Dirección</h3><p>Dirección: Av. Amazonas y Colón, Quito – Ecuador</p></div><div class="footer-col"><h3>Síguenos</h3><div class="footer-socials"><a href="https://api.whatsapp.com/send?phone=593997000496&text=%C2%A1Hola%20Iyayku%20Innova%20Editores!%20me%20gustar%C3%ADa%20saber%20m%C3%A1s%20informaci%C3%B3n%20acerca%20de%20la%20asesor%C3%ADa%20y%20publicaci%C3%B3n%20de%20art%C3%ADculos%20cient%C3%ADficos.%20%E2%9C%8D%EF%B8%8F%F0%9F%93%8A%F0%9F%93%9D" target="_blank" rel="noopener noreferrer"><img src="/svgs/whatsapp_black_logo_icon_147050.svg" alt="WhatsApp" /></a><a href="https://www.facebook.com/Iyaykutec" target="_blank" rel="noopener noreferrer"><img src="/svgs/facebook_black_logo_icon_147136.svg" alt="Facebook" /></a><a href="https://www.instagram.com/iyaykutec" target="_blank" rel="noopener noreferrer"><img src="/svgs/instagram_black_logo_icon_147122.svg" alt="Instagram" /></a></div></div><div class="footer-col"><h3>Información</h3><p>Email: iyayku@gmail.com</p><p>Teléfonos: 0995000484 · 0979369650 · 0997000496</p></div></footer>', 99);

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
'<section class="editoriales"><div class="editorial"><h2>Editorial Innova</h2><p>Editorial Innova es una iniciativa ecuatoriana con visión internacional que nace del compromiso por impulsar la ciencia abierta y democratizar el acceso al conocimiento... (texto completo aquí) ...</p><p class="frase-final">¡Innovación que trasciende, ideas que perduran!</p><div class="boton-container"><a href="https://editorialinnova.com/" class="btn-editorial" target="_blank">Visitar Sitio</a></div></div><div class="editorial"><h2>Editorial Sphaera</h2><p>Editorial Sphaera es una editorial académica ecuatoriana con un enfoque moderno... (texto completo aquí) ...</p><div class="boton-container"><a href="https://editorialsphaera.com/" class="btn-editorial" target="_blank">Visitar Sitio</a></div></div></section>', 1);

-- Contacto
INSERT INTO public.paginas_contenido (pagina, seccion, titulo, contenido, orden) VALUES
('contacto', 'principal', 'Contacto',
'<div class="contacto-wrapper">... (formulario completo aquí) ...</div>', 1);

-- Inicio
INSERT INTO public.paginas_contenido (pagina, seccion, titulo, contenido, orden) VALUES
('inicio', 'principal', 'Inicio',
'<section class="inicio-empresa"><div class="inicio-contenido"><h1>Innovación que trasciende, ideas que perduran</h1><p>En <strong>IYAYKU Innovación Tecnológica</strong> creemos que la tecnología, la ciencia y la educación pueden transformar el presente y proyectar un futuro más sostenible...</p><a href="#nuestros-servicios" class="btn-principal">Conoce nuestros servicios</a></div><div class="inicio-imagen"><img src="/Images/Inovacion.jpg" alt="Innovación IYAYKU" /></div></section>', 1);
