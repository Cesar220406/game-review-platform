const articles = [
  {
    titulo: "El auge de los remakes: ¿nostalgia o falta de ideas?",
    slug: "el-auge-de-los-remakes-nostalgia-o-falta-de-ideas",
    extracto: "Los remakes dominan la industria del videojuego en 2025. Analizamos si se trata de una apuesta segura basada en la nostalgia o de una señal de estancamiento creativo.",
    contenido: "La industria del videojuego vive un momento curioso: cada año se anuncian más remakes y remasters de títulos clásicos.\n\n## La nostalgia como motor de ventas\n\nLa nostalgia vende, y vende muy bien. Los jugadores que crecieron con determinadas sagas ahora tienen poder adquisitivo.\n\n## Innovación frente a riesgo financiero\n\nDesarrollar una nueva IP implica un riesgo elevado. En cambio, apostar por una marca ya conocida reduce la incertidumbre.\n\n## ¿Qué espera el jugador en 2025?\n\nEl jugador actual es más exigente. No basta con mejorar texturas; se espera una reinterpretación profunda.",
    fechaPublicacion: "2025-01-12T10:30:00.000Z",
    metaTitle: "El auge de los remakes en videojuegos 2025",
    metaDescription: "Analizamos por qué los remakes dominan la industria gaming en 2025 y si la nostalgia está frenando la innovación creativa."
  },
  {
    titulo: "Inteligencia artificial en videojuegos: enemigos más humanos que nunca",
    slug: "inteligencia-artificial-en-videojuegos-enemigos-mas-humanos-que-nunca",
    extracto: "La IA está transformando la forma en que interactuamos con los videojuegos.",
    contenido: "La inteligencia artificial se ha convertido en uno de los pilares tecnológicos del desarrollo de videojuegos modernos.\n\n## De patrones predecibles a comportamientos dinámicos\n\nHace años, los enemigos seguían rutinas claras y repetitivas. Hoy los sistemas de IA permiten que los personajes se adapten al estilo del jugador.\n\n## NPC con diálogos generativos\n\nOtro salto importante es la integración de modelos de lenguaje que generan diálogos dinámicos.\n\n## Retos éticos y técnicos\n\nEl uso de IA avanzada también plantea desafíos. El equilibrio entre dificultad y frustración es delicado.",
    fechaPublicacion: "2025-01-28T18:45:00.000Z",
    metaTitle: "IA en videojuegos: revolución en 2025",
    metaDescription: "Descubre cómo la inteligencia artificial está transformando enemigos y NPC en videojuegos."
  },
  {
    titulo: "La cultura gamer en 2025: más allá de jugar",
    slug: "la-cultura-gamer-en-2025-mas-alla-de-jugar",
    extracto: "La cultura gamer evoluciona hacia un fenómeno social global que abarca streaming, esports y creación de contenido.",
    contenido: "Ser gamer en 2025 significa mucho más que jugar.\n\n## El impacto del streaming\n\nPlataformas de streaming han cambiado la forma en que consumimos videojuegos.\n\n## Esports como espectáculo global\n\nLos deportes electrónicos siguen consolidándose como eventos masivos.\n\n## Identidad y comunidad\n\nLa cultura gamer también es identidad. Foros, redes sociales y eventos presenciales fortalecen el sentido de pertenencia.",
    fechaPublicacion: "2025-02-05T12:00:00.000Z",
    metaTitle: "Cultura gamer 2025: tendencias y evolución",
    metaDescription: "Exploramos cómo la cultura gamer en 2025 va más allá de jugar."
  },
  {
    titulo: "Cómo elegir tu próximo RPG: guía para no perderte entre gigantes",
    slug: "como-elegir-tu-proximo-rpg-guia-para-no-perderte-entre-gigantes",
    extracto: "El mercado está lleno de RPG extensos y ambiciosos. Te damos claves prácticas para elegir el que mejor encaje contigo.",
    contenido: "El género RPG vive una etapa dorada.\n\n## Define tu estilo de juego\n\nAntes de comprar, pregúntate qué buscas: ¿combate por turnos o en tiempo real?\n\n## Duración y compromiso\n\nMuchos RPG superan fácilmente las 80 horas. Revisar la duración estimada es clave.\n\n## Comunidad y soporte\n\nUn RPG con comunidad activa puede enriquecer la experiencia gracias a guías y mods.",
    fechaPublicacion: "2025-02-14T16:20:00.000Z",
    metaTitle: "Cómo elegir tu próximo RPG en 2025",
    metaDescription: "Guía práctica para elegir el mejor RPG según tu estilo y tiempo disponible."
  },
  {
    titulo: "El futuro del gaming en la nube: ¿adiós a las consolas?",
    slug: "el-futuro-del-gaming-en-la-nube-adios-a-las-consolas",
    extracto: "El juego en la nube promete eliminar barreras de hardware. Analizamos si realmente sustituirá a las consolas tradicionales.",
    contenido: "El gaming en la nube ha ganado terreno en los últimos años.\n\n## Acceso sin barreras\n\nNo necesitas una consola o PC de alta gama. Basta con una buena conexión a internet.\n\n## Limitaciones técnicas\n\nLa latencia sigue siendo un desafío. En juegos competitivos, milisegundos pueden marcar la diferencia.\n\n## Modelo de negocio y propiedad digital\n\nEl gaming en la nube suele basarse en suscripciones, lo que cambia la percepción de propiedad.",
    fechaPublicacion: "2025-02-22T09:15:00.000Z",
    metaTitle: "Gaming en la nube en 2025: futuro y retos",
    metaDescription: "Analizamos el futuro del gaming en la nube y si reemplazará a las consolas tradicionales."
  }
];

async function seed() {
  for (const articulo of articles) {
    const res = await fetch("http://localhost:1337/api/articulos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: articulo }),
    });
    const json = await res.json();
    if (json.data) {
      console.log(`✅ Creado: ${articulo.titulo}`);
    } else {
      console.log(`❌ Error en: ${articulo.titulo}`, JSON.stringify(json.error));
    }
  }
}

seed();