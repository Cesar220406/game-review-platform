const fs = require('fs');
const articles = JSON.parse(fs.readFileSync('./articulos-seed.json', 'utf-8'));

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