export function calcularTiempoLectura(texto) {
  if (!texto) return 0;
  const palabras = texto.trim().split(/\s+/).length;
  const minutos = Math.ceil(palabras / 200);
  return minutos;
}
