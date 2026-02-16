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
      generos: generos?.map(g => g.nombre) || [],
    };
  });
}

export async function getVideojuegos() {
  const { data } = await fetchStrapi("/videojuegos?populate=generos");

  return data.map((item) => {
    const { id, titulo, slug, descripcionCorta, destacado, generos } = item;
    
    return { 
      id, 
      titulo, 
      slug, 
      descripcionCorta, 
      destacado,
      generos: generos?.map(g => g.slug) || [] // SLUGS DE LOS GENEROS
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