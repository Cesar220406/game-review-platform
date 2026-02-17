/**
 * Script para poblar Strapi con datos de Pixelcrit
 *
 * USO:
 *   1. Copia este archivo y seed-data.json a la raíz de tu proyecto Strapi
 *   2. Asegúrate de que Strapi está corriendo (npm run develop)
 *   3. Ejecuta: node seed.js
 *
 * REQUISITOS:
 *   - Strapi corriendo en http://localhost:1337
 *   - Permisos de API pública habilitados para create en todos los content types
 *     O bien usa un token de API (recomendado)
 *
 * CONFIGURACIÓN:
 *   Cambia STRAPI_URL y API_TOKEN según tu entorno
 */

const STRAPI_URL = "http://46.225.167.247:1337";
// Opción 1: Sin token (necesitas habilitar create en Public role)
// const API_TOKEN = null;

// Opción 2: Con token (recomendado) — Créalo en Settings > API Tokens > Create new API Token (Full Access)
const API_TOKEN = "34dc30d4c81c0551c437ccb5cf8f55812272b4d3ac85b1b28c688d5cd0395935fdb5a8fab488d61952e9d70f426ed9a637bfd1e15acea626fbd5a625df755da7c99e333353a222f50fc601a512e71add678c8adb160dda80b9095936e19dc39722891dcfd8c5c569279126139f332508bdb8fdc2d26612e22c8489504d9cbc6e";

// ─────────────────────────────────────────────
// No toques nada debajo de esta línea
// ─────────────────────────────────────────────

const fs = require("fs");
const path = require("path");

const data = JSON.parse(
  fs.readFileSync(path.join(__dirname, "seed-data.json"), "utf-8")
);

const headers = {
  "Content-Type": "application/json",
  ...(API_TOKEN && API_TOKEN !== "TU_TOKEN_AQUI"
    ? { Authorization: `Bearer ${API_TOKEN}` }
    : {}),
};

async function post(endpoint, body) {
  const url = `${STRAPI_URL}/api/${endpoint}`;
  const res = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify({ data: body }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(
      `Error POST ${endpoint}: ${res.status} - ${JSON.stringify(error)}`
    );
  }

  const json = await res.json();
  return json.data;
}

async function seed() {
  console.log("🎮 Iniciando seed de Pixelcrit...\n");

  // ── 1. Géneros ────────────────────────────
  console.log("📁 Creando géneros...");
  const generoMap = {}; // nombre → id

  for (const genero of data.generos) {
    try {
      const created = await post("generos", {
        nombre: genero.nombre,
        slug: genero.slug,
        descripcion: genero.descripcion,
      });
      generoMap[genero.nombre] = created.id;
      console.log(`   ✅ ${genero.nombre} (id: ${created.id})`);
    } catch (err) {
      console.log(`   ❌ ${genero.nombre}: ${err.message}`);
    }
  }

  // ── 2. Plataformas ────────────────────────
  console.log("\n🕹️  Creando plataformas...");
  const plataformaMap = {}; // nombre → id

  for (const plat of data.plataformas) {
    try {
      const created = await post("plataformas", {
        nombre: plat.nombre,
        slug: plat.slug,
      });
      plataformaMap[plat.nombre] = created.id;
      console.log(`   ✅ ${plat.nombre} (id: ${created.id})`);
    } catch (err) {
      console.log(`   ❌ ${plat.nombre}: ${err.message}`);
    }
  }

  // ── 3. Videojuegos ────────────────────────
  console.log("\n🎮 Creando videojuegos...");

  for (const juego of data.videojuegos) {
    // Mapear nombres de géneros/plataformas a IDs
    const generoIds = juego.generos
      .map((nombre) => generoMap[nombre])
      .filter(Boolean);

    const plataformaIds = juego.plataformas
      .map((nombre) => plataformaMap[nombre])
      .filter(Boolean);

    try {
      const created = await post("videojuegos", {
        titulo: juego.titulo,
        slug: juego.slug,
        descripcionCorta: juego.descripcionCorta,
        descripcionCompleta: juego.descripcionCompleta,
        fechaLanzamiento: juego.fechaLanzamiento,
        desarrolladora: juego.desarrolladora,
        puntuacion: juego.puntuacion,
        metaTitle: juego.metaTitle,
        metaDescription: juego.metaDescription,
        destacado: juego.destacado,
        generos: generoIds,
        plataformas: plataformaIds,
      });
      console.log(`   ✅ ${juego.titulo} (id: ${created.id})`);
    } catch (err) {
      console.log(`   ❌ ${juego.titulo}: ${err.message}`);
    }
  }

  // ── 4. Artículos ──────────────────────────
  console.log("\n📝 Creando artículos del blog...");

  for (const art of data.articulos) {
    try {
      const created = await post("articulos", {
        titulo: art.titulo,
        slug: art.slug,
        extracto: art.extracto,
        contenido: art.contenido,
        fechaPublicacion: art.fechaPublicacion,
        metaTitle: art.metaTitle,
        metaDescription: art.metaDescription,
      });
      console.log(`   ✅ ${art.titulo} (id: ${created.id})`);
    } catch (err) {
      console.log(`   ❌ ${art.titulo}: ${err.message}`);
    }
  }

  // ── 5. Contactos ──────────────────────────
  console.log("\n📧 Creando contactos de ejemplo...");

  for (const contacto of data.contactos) {
    try {
      const created = await post("contactos", {
        nombre: contacto.nombre,
        email: contacto.email,
        asunto: contacto.asunto,
        mensaje: contacto.mensaje,
        fecha: contacto.fecha,
      });
      console.log(`   ✅ ${contacto.nombre} (id: ${created.id})`);
    } catch (err) {
      console.log(`   ❌ ${contacto.nombre}: ${err.message}`);
    }
  }

  console.log("\n🏁 ¡Seed completado!");
  console.log("⚠️  Recuerda subir las imágenes manualmente desde el panel de Strapi.");
  console.log("   Ve a cada Videojuego/Artículo y añade imagenPrincipal, galeria e imagenDestacada.");
}

seed().catch(console.error);
