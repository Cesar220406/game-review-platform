const API_URL = "http://46.225.167.247:1337/api";
/**
 * @typedef {Object} Videojuego
 * @property {number} id
 * @property {string} titulo
 * @property {string} slug
 * @property {string} [descripcionCorta]
 * @property {boolean} [destacado]
 * @property {string[]} generos
 */

async function fetchStrapi(endpoint) {
  const response = await fetch(`${API_URL}${endpoint}`);

  if (!response.ok) {
    throw new Error(`Error ${response.status}: ${response.statusText}`);
  }

  return response.json();
}

export async function getVideojuegosDestacados() {
  const { data } = await fetchStrapi("/videojuegos?filters[destacado][$eq]=true&populate=*");

  return data.map((item) => {
    const { id, titulo, slug, descripcionCorta, destacado, puntuacion, imagenPrincipal, generos } = item;
    const imagen = imagenPrincipal?.url
      ? `http://46.225.167.247:1337${imagenPrincipal.url}`
      : null;
    return {
      id, titulo, slug, descripcionCorta, destacado, puntuacion, imagen,
      generos: generos?.map(g => ({ nombre: g.nombre, slug: g.slug })) || [],
    };
  });
}

export async function getVideojuegos() {
  const { data } = await fetchStrapi("/videojuegos?populate=*");

  return data.map((item) => {
    const { id, titulo, slug, descripcionCorta, destacado, puntuacion, imagenPrincipal, generos } = item;
    const imagen = imagenPrincipal?.url
      ? `http://46.225.167.247:1337${imagenPrincipal.url}`
      : null;
    return {
      id,
      titulo,
      slug,
      descripcionCorta,
      destacado,
      puntuacion,
      imagen,
      generos: generos?.map(g => ({ nombre: g.nombre, slug: g.slug })) || [],
    };
  });
}

export async function getGeneros() {
  const { data } = await fetchStrapi("/generos");
  return data.map(({ id, nombre, slug }) => ({ id, nombre, slug }));
}

// Función para obtener contenido de la home
export async function getHome() {
  try {
    const response = await fetch(
      `${API_URL}/home?populate=heroImagen`
    );
    
    if (!response.ok) {
      throw new Error('Error al obtener contenido de home');
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error en getHome:', error);
    throw error;
  }
}

export async function getPlatforms() {
  try {
    const res = await fetch(`${API_URL}/plataformas`);
    if (!res.ok) throw new Error("Error al obtener plataformas");
    const { data } = await res.json();
    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
}
export async function getVideojuegoPorSlug(slug) {
  try {
    const res = await fetch(
      `${API_URL}/videojuegos?filters[slug][$eq]=${slug}&populate=*`
    );
    if (!res.ok) throw new Error("Error al obtener el videojuego");
    const { data } = await res.json();
    return data[0] ?? null;
  } catch (error) {
    console.error(error);
    return null;
  }
}
export async function getGenerosConJuegos() {
  const { data } = await fetchStrapi("/generos?populate=videojuegos.imagenPrincipal");
  return data.map(({ id, nombre, slug, descripcion, videojuegos }) => ({
    id,
    nombre,
    slug,
    descripcion: descripcion || "",
    totalJuegos: videojuegos?.length || 0,
    juegos: (videojuegos || []).map((v) => ({
      id: v.id,
      titulo: v.titulo,
      slug: v.slug,
      descripcionCorta: v.descripcionCorta,
      puntuacion: v.puntuacion,
      imagen: v.imagenPrincipal?.url
        ? `http://46.225.167.247:1337${v.imagenPrincipal.url}`
        : null,
    })),
  }));
}

export async function getVideojuegosPorGenero(generoSlug) {
  const { data } = await fetchStrapi(
    `/videojuegos?filters[generos][slug][$eq]=${generoSlug}&populate=*`
  );
  return data.map((item) => {
    const { id, titulo, slug, descripcionCorta, puntuacion, imagenPrincipal, generos } = item;
    const imagen = imagenPrincipal?.url
      ? `http://46.225.167.247:1337${imagenPrincipal.url}`
      : null;
    return {
      id, titulo, slug, descripcionCorta, puntuacion, imagen,
      generos: generos?.map(g => g.nombre) || [],
    };
  });
}

export async function getArticulos() {
  const { data } = await fetchStrapi("/articulos?sort=fechaPublicacion:desc&populate=*");
  return data.map((item) => {
    const { id, titulo, slug, extracto, contenido, fechaPublicacion, imagenDestacada, metaTitle, metaDescription } = item;
    const imagen = imagenDestacada?.url
      ? `http://46.225.167.247:1337${imagenDestacada.url}`
      : null;
    return { id, titulo, slug, extracto, contenido, fechaPublicacion, imagen, metaTitle, metaDescription };
  });
}

export async function getArticuloPorSlug(slug) {
  try {
    const res = await fetch(`${API_URL}/articulos?filters[slug][$eq]=${slug}&populate=*`);
    if (!res.ok) throw new Error("Error al obtener el artículo");
    const { data } = await res.json();
    return data[0] ?? null;
  } catch (error) {
    console.error(error);
    return null;
  }
}