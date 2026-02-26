const fs = require('fs');
const videojuegos = JSON.parse(fs.readFileSync('./videojuegos-seed.json', 'utf-8'));

async function seed() {
  for (const videojuego of videojuegos) {
    const res = await fetch("http://localhost:1337/api/videojuegos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: videojuego }),
    });
    const json = await res.json();
    if (json.data) {
      console.log(`✅ Creado: ${videojuego.titulo}`);
    } else {
      console.log(`❌ Error en: ${videojuego.titulo}`, JSON.stringify(json.error));
    }
  }
}

seed();
